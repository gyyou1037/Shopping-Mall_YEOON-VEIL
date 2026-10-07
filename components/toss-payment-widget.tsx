"use client";

import {
  ANONYMOUS,
  loadTossPayments,
  type TossPaymentsWidgets,
  type WidgetAgreementWidget,
  type WidgetPaymentMethodWidget,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

type Props = {
  amount: number;
  onReady: (widgets: TossPaymentsWidgets) => void;
};

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

// Dev Strict Mode runs this effect twice. The SDK allows only one payment-method
// widget, so every render and destroy must run one at a time.
let widgetQueue: Promise<void> = Promise.resolve();

function enqueueWidgetTask(task: () => Promise<void>) {
  const run = widgetQueue.then(task, task);
  widgetQueue = run.then(
    () => undefined,
    () => undefined,
  );
}

async function destroyWidgets(
  paymentMethodWidget: WidgetPaymentMethodWidget | null,
  agreementWidget: WidgetAgreementWidget | null,
) {
  await Promise.all([
    paymentMethodWidget?.destroy().catch(() => undefined),
    agreementWidget?.destroy().catch(() => undefined),
  ]);
}

export function TossPaymentWidget({ amount, onReady }: Props) {
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let paymentMethodWidget: WidgetPaymentMethodWidget | null = null;
    let agreementWidget: WidgetAgreementWidget | null = null;

    enqueueWidgetTask(async () => {
      if (cancelled || !CLIENT_KEY) {
        if (!CLIENT_KEY && !cancelled) setError("결제 설정이 올바르지 않습니다.");
        return;
      }
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY);
        if (cancelled) return;

        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        await widgets.setAmount({ currency: "KRW", value: amount });
        if (cancelled) return;

        // Assign each widget as soon as it renders so a later failure can still destroy it.
        await Promise.all([
          widgets
            .renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" })
            .then((widget) => {
              paymentMethodWidget = widget;
            }),
          widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }).then((widget) => {
            agreementWidget = widget;
          }),
        ]);
        if (cancelled) {
          await destroyWidgets(paymentMethodWidget, agreementWidget);
          paymentMethodWidget = null;
          agreementWidget = null;
          return;
        }

        setError("");
        onReady(widgets);
      } catch (e) {
        console.error("Failed to load TossPayments widgets", e);
        await destroyWidgets(paymentMethodWidget, agreementWidget);
        paymentMethodWidget = null;
        agreementWidget = null;
        if (!cancelled) {
          setError("결제 화면을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.");
        }
      }
    });

    return () => {
      cancelled = true;
      enqueueWidgetTask(async () => {
        await destroyWidgets(paymentMethodWidget, agreementWidget);
        paymentMethodWidget = null;
        agreementWidget = null;
      });
    };
    // onReady is a parent state setter; amount is fixed for a given checkout page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  return (
    <div className="toss-widget">
      <div id="payment-method" />
      <div id="agreement" />
      {error ? (
        <p className="form-status error" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
