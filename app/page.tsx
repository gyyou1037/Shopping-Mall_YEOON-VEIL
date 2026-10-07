import Link from "next/link";
import { GallerySection } from "@/components/gallery-section";
import { Photo } from "@/components/photo";
import { PurchaseDialog } from "@/components/purchase-dialog";
import { SiteHeader } from "@/components/site-header";

const principles = [
  {
    number: "01",
    title: "피부를 바라보는 시간",
    body: (
      <>
        오늘의 피부 상태를 살피며,
        <br />
        나에게 편안한 루틴을 찾아갑니다.
      </>
    ),
  },
  {
    number: "02",
    title: "손끝에 머무는 감각",
    body: (
      <>
        바르고 기다리는 작은 순간까지,
        <br />
        스킨케어의 과정을 음미합니다.
      </>
    ),
  },
  {
    number: "03",
    title: "꾸준히 이어가는 여유",
    body: (
      <>
        특별한 날만을 위한 것이 아닌,
        <br />
        매일 나를 돌보는 습관을 만듭니다.
      </>
    ),
  },
];

const faqs = [
  {
    question: "VEIL 세럼은 어디에서 구매할 수 있나요?",
    answer:
      "현재 판매 정보가 준비 중입니다. 구매처, 가격, 용량은 공식 제품 정보가 확정되면 안내할 예정입니다.",
  },
  {
    question: "어떤 성분이 들어 있나요?",
    answer:
      "현재 전성분 정보는 공개 전입니다. 특정 성분이나 알레르기 유발 성분이 걱정된다면, 구매 전 제품의 전성분 표시를 확인해 주세요.",
  },
  {
    question: "사용 순서는 어떻게 되나요?",
    answer:
      "일반적으로 세안과 피부 정돈 후 세럼을 사용하고, 필요에 따라 보습 제품으로 마무리합니다. 사용량과 사용법은 실제 제품의 표시사항을 따라 주세요.",
  },
  {
    question: "모든 피부에 사용할 수 있나요?",
    answer:
      "사용 적합성은 개인의 피부 상태와 제품 성분에 따라 달라질 수 있습니다. 제품 정보를 확인한 뒤 사용해 주세요. 사용 중 불편함이 느껴지면 사용을 중단해 주세요.",
  },
  {
    question: "배송과 교환·반품은 어떻게 진행되나요?",
    answer:
      "배송 및 교환·반품 정책은 판매 시작 시 구매처에서 안내할 예정입니다. 현재 이 페이지에서는 주문과 결제가 이루어지지 않습니다.",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        본문 바로가기
      </a>
      <div className="announcement">A QUIET MOMENT, JUST FOR YOU.</div>
      <SiteHeader />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <Photo
            className="hero-image"
            src="/images/image-08.jpg"
            width={2400}
            height={1345}
            priority
            alt="따뜻한 아침 햇살이 드는 대리석 위 골드 캡의 VEIL 세럼"
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">THE ART OF EVERYDAY CARE</p>
            <h1 id="hero-title">
              나를 위한
              <br />
              빛의 시간.
            </h1>
            <p>
              분주한 일상 사이, 오롯이 나에게.
              <br />
              VEIL과 함께 시작하는 고요한 스킨케어 리추얼.
            </p>
            <a className="button light" href="#serum">
              VEIL 세럼 만나보기
            </a>
          </div>
          <div className="hero-bottom">
            <span>VEIL SKINCARE</span>
            <span>빛, 여백, 그리고 나.</span>
            <span>SCROLL TO DISCOVER</span>
          </div>
        </section>

        <section id="story" className="intro section">
          <p className="eyebrow">LESS, BUT MORE MEANINGFUL</p>
          <h2>
            덜어낼수록,
            <br />더 선명해지는 나다움.
          </h2>
          <p className="muted">
            아침의 부드러운 빛, 손끝에 닿는 작은 온기.
            <br />
            VEIL은 매일의 스킨케어가 나를 돌보는 시간이 되기를 바랍니다.
            <br />
            충분히 천천히, 나만의 속도로.
          </p>
          <span className="signature">Your skin. Your quiet moment.</span>
        </section>

        <section id="serum" className="product section wrap">
          <div className="product-visual">
            <Photo
              src="/images/image-06.jpg"
              width={1024}
              height={1024}
              alt="크림빛 유리 보틀과 골드 캡이 어우러진 VEIL 세럼"
            />
            <span className="image-caption">THE VEIL COLLECTION / 01</span>
          </div>
          <div className="product-copy">
            <p className="eyebrow">THE EVERYDAY ESSENTIAL</p>
            <h2>
              <span className="serif">The VEIL Serum</span>
              <small>베일 세럼</small>
            </h2>
            <p className="lead">
              매일의 루틴에,
              <br />
              나를 아끼는 한 순간.
            </p>
            <p className="muted">
              화장대 위에 놓인 작은 여유.
              <br />
              하루의 시작과 끝에, 피부를 살피고
              <br />
              나에게 집중하는 시간을 더해보세요.
            </p>
            <div className="product-values">
              <span>고요한 루틴</span>
              <span>섬세한 감각</span>
              <span>일상의 여유</span>
            </div>
            <div className="product-actions">
              <Link className="button dark" href="/products/veil-serum">
                자세히 보기 · 구매하기
              </Link>
              <PurchaseDialog />
            </div>
            <p className="fine">제품 상세 정보와 판매 일정은 준비 중입니다.</p>
          </div>
        </section>

        <section className="principles wrap section" aria-label="VEIL의 스킨케어 철학">
          {principles.map((item) => (
            <div key={item.number}>
              <span className="number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </section>

        <section className="lifestyle" id="journal">
          <div className="lifestyle-copy">
            <p className="eyebrow">THE VEIL JOURNAL</p>
            <h2>
              가장 자연스러운
              <br />
              나의 순간.
            </h2>
            <p>
              창가에 내려앉은 오후의 빛.
              <br />
              잠시 느려져도 괜찮은 시간.
              <br />
              아름다움은 그렇게 일상에 머뭅니다.
            </p>
            <a className="text-link" href="#gallery">
              VEIL의 순간들 보기
            </a>
          </div>
          <Photo
            src="/images/image-01.jpg"
            width={1024}
            height={1024}
            alt="햇살이 드는 창가에서 크림색 셔츠를 입은 모델"
          />
        </section>

        <section id="ritual" className="ritual section wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A DAILY RITUAL</p>
              <h2>
                하루를 여는,
                <br />
                나만의 순서.
              </h2>
            </div>
            <p className="muted">
              서두르지 않아도 괜찮아요.
              <br />
              피부를 돌보는 시간만큼은 온전히 나에게.
            </p>
          </div>
          <div className="ritual-grid">
            <Photo
              src="/images/image-04.jpg"
              width={1024}
              height={1024}
              alt="아침 햇살과 패브릭 곁에 놓인 VEIL 세럼"
            />
            <div className="steps">
              <article>
                <span>01 / PREPARE</span>
                <h3>깨끗하게 준비하기</h3>
                <p>
                  세안 후, 평소 사용하는 기초 제품으로
                  <br />
                  피부를 정돈해 주세요.
                </p>
              </article>
              <article>
                <span>02 / APPLY</span>
                <h3>천천히 펴 바르기</h3>
                <p>
                  제품에 표시된 사용량과 방법을 확인하고,
                  <br />
                  눈가를 피해 부드럽게 펴 발라 주세요.
                </p>
              </article>
              <article>
                <span>03 / FINISH</span>
                <h3>나만의 루틴으로 마무리</h3>
                <p>
                  필요에 따라 보습 제품을 덧바르고,
                  <br />
                  아침에는 자외선 차단 단계로 마무리하세요.
                </p>
              </article>
              <p className="fine">
                일반적인 스킨케어 순서입니다. 실제 사용 시 제품의 표시사항을 우선 확인해 주세요.
              </p>
            </div>
          </div>
        </section>

        <section className="texture section">
          <div className="wrap texture-grid">
            <div>
              <p className="eyebrow">THOUGHTFUL IN EVERY DETAIL</p>
              <h2>
                빛을 담은 보틀,
                <br />
                섬세함을 담은 시선.
              </h2>
              <p className="muted">
                은은하게 빛나는 골드와 부드러운 크림 톤.
                <br />
                VEIL의 감각은 작은 디테일에서 시작됩니다.
              </p>
              <details>
                <summary>성분과 텍스처 안내</summary>
                <p>
                  전성분 및 실제 제형 정보는 제품 상세 정보와 함께 공개될 예정입니다. 이미지는 브랜드
                  연출 이미지이며, 사진만으로 성분이나 사용감을 판단할 수 없습니다.
                </p>
              </details>
            </div>
            <figure>
              <Photo
                src="/images/image-05.jpg"
                width={1024}
                height={1024}
                alt="골드 캡과 반투명 보틀의 디테일을 보여주는 VEIL 제품 이미지"
              />
              <figcaption>GOLDEN LIGHT, QUIET DETAILS.</figcaption>
            </figure>
          </div>
        </section>

        <GallerySection />

        <section className="reviews section">
          <p className="eyebrow">YOUR VOICE, OUR NEXT CHAPTER</p>
          <h2>당신의 이야기를 기다립니다.</h2>
          <p className="muted">
            VEIL과 함께한 경험이 모일 이곳.
            <br />
            아직 등록된 고객 후기가 없습니다.
          </p>
          <a className="text-link" href="#serum">
            먼저 VEIL 만나보기
          </a>
        </section>

        <section className="faq section wrap" id="faq">
          <div>
            <p className="eyebrow">GOOD TO KNOW</p>
            <h2>자주 묻는 질문</h2>
          </div>
          <div className="faq-items">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="closing">
          <Photo
            src="/images/image-11.jpg"
            width={2400}
            height={1345}
            alt="따뜻한 빛으로 채워진 VEIL의 스킨케어 공간"
          />
          <div>
            <p className="eyebrow">MAKE ROOM FOR YOURSELF</p>
            <h2>오늘도, 나에게 다정하게.</h2>
            <a className="button light" href="#serum">
              나의 VEIL 만나보기
            </a>
          </div>
        </section>
      </main>
      <footer className="footer wrap">
        <div>
          <a className="logo" href="#main">
            VEIL
          </a>
          <p>
            빛, 여백, 그리고 나.
            <br />
            THE ART OF EVERYDAY CARE.
          </p>
        </div>
        <div className="footer-links">
          <a href="#story">브랜드 이야기</a>
          <a href="#ritual">사용 가이드</a>
          <a href="#faq">고객 안내</a>
        </div>
        <div className="footer-bottom">
          <span>
            © <span id="year">{new Date().getFullYear()}</span> VEIL. All rights reserved.
          </span>
          <span>브랜드 콘셉트 페이지 · 판매 준비 중</span>
        </div>
      </footer>
    </>
  );
}
