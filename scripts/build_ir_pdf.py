"""AI-MBTI IR/PR PDF 생성 스크립트 (reportlab).

실행: python3 scripts/build_ir_pdf.py
출력: docs/IR_AI-MBTI.pdf
"""
from pathlib import Path
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak,
    Table, TableStyle, KeepTogether, ListFlowable, ListItem,
)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "docs" / "IR_AI-MBTI.pdf"

FONT_DIR = Path.home() / ".local" / "share" / "fonts"
pdfmetrics.registerFont(TTFont("Nanum", str(FONT_DIR / "NanumGothic-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Nanum-Bold", str(FONT_DIR / "NanumGothic-Bold.ttf")))

NAVY = colors.HexColor("#0B1F3A")
ACCENT = colors.HexColor("#2E7DFF")
GRAY = colors.HexColor("#555B66")
LIGHT = colors.HexColor("#E8EEF7")
WHITE = colors.white

STYLES = {
    "title_xl": ParagraphStyle("title_xl", fontName="Nanum-Bold", fontSize=48, alignment=TA_CENTER,
                               textColor=NAVY, leading=56, spaceAfter=6),
    "title_sub": ParagraphStyle("title_sub", fontName="Nanum", fontSize=18, alignment=TA_CENTER,
                                textColor=ACCENT, leading=24, spaceAfter=4),
    "tagline": ParagraphStyle("tagline", fontName="Nanum", fontSize=12, alignment=TA_CENTER,
                              textColor=GRAY, leading=16),
    "meta_footer": ParagraphStyle("meta_footer", fontName="Nanum", fontSize=11, alignment=TA_CENTER,
                                  textColor=GRAY, leading=14),
    "h1": ParagraphStyle("h1", fontName="Nanum-Bold", fontSize=22, textColor=NAVY,
                         leading=28, spaceBefore=4, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="Nanum-Bold", fontSize=13, textColor=ACCENT,
                         leading=17, spaceBefore=10, spaceAfter=3),
    "body": ParagraphStyle("body", fontName="Nanum", fontSize=10, textColor=colors.black,
                           leading=15, spaceAfter=4),
    "body_lg": ParagraphStyle("body_lg", fontName="Nanum", fontSize=11, textColor=colors.black,
                              leading=16, spaceAfter=6),
    "small_gray": ParagraphStyle("small_gray", fontName="Nanum", fontSize=9, textColor=GRAY,
                                 leading=13, spaceAfter=2),
    "caption": ParagraphStyle("caption", fontName="Nanum", fontSize=9, alignment=TA_CENTER,
                              textColor=GRAY, leading=12, spaceAfter=6),
    "bullet": ParagraphStyle("bullet", fontName="Nanum", fontSize=10, textColor=colors.black,
                             leading=15, leftIndent=12, bulletIndent=0),
}


def P(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, STYLES[style])


def bullets(items: list[str]) -> ListFlowable:
    return ListFlowable(
        [ListItem(P(it, "bullet"), leftIndent=14, bulletColor=ACCENT) for it in items],
        bulletType="bullet",
        bulletFontName="Nanum",
        bulletFontSize=8,
        start="•",
        leftIndent=6,
    )


def fit_image(rel_path: str, max_w_cm: float, max_h_cm: float = 12.0) -> Image | None:
    img_path = PUBLIC / rel_path
    if not img_path.exists():
        return None
    try:
        with PILImage.open(img_path) as im:
            w, h = im.size
        ratio = w / h
        max_w = max_w_cm * cm
        max_h = max_h_cm * cm
        if ratio > max_w / max_h:
            w_out = max_w
            h_out = max_w / ratio
        else:
            h_out = max_h
            w_out = max_h * ratio
        img = Image(str(img_path), width=w_out, height=h_out)
        return img
    except Exception:
        return None


def centered_image(rel_path: str, max_w_cm: float = 14.0, max_h_cm: float = 10.0,
                   caption: str | None = None):
    img = fit_image(rel_path, max_w_cm, max_h_cm)
    if img is None:
        return [P(f"[이미지 없음: {rel_path}]", "small_gray")]
    img.hAlign = "CENTER"
    flows = [img]
    if caption:
        flows.append(Spacer(1, 2 * mm))
        flows.append(P(caption, "caption"))
    return flows


def image_row(entries: list[tuple[str, str]], total_w_cm: float = 17.0, max_h_cm: float = 6.0):
    """Side-by-side images with captions underneath."""
    valid = [(p, c) for p, c in entries if (PUBLIC / p).exists()]
    if not valid:
        return [P("[이미지 없음]", "small_gray")]
    n = len(valid)
    col_w = total_w_cm / n
    img_row = []
    cap_row = []
    for rel, cap in valid:
        img = fit_image(rel, col_w - 0.3, max_h_cm)
        img_row.append(img if img else P("?", "small_gray"))
        cap_row.append(P(cap, "caption"))
    tbl = Table([img_row, cap_row], colWidths=[col_w * cm] * n)
    tbl.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, 0), "MIDDLE"),
        ("VALIGN", (0, 1), (-1, 1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 4),
        ("TOPPADDING", (0, 1), (-1, 1), 2),
    ]))
    tbl.hAlign = "CENTER"
    return [tbl]


def data_table(headers: list[str], rows: list[list[str]], col_widths_cm: list[float] | None = None):
    data = [headers] + rows
    if col_widths_cm:
        col_widths = [w * cm for w in col_widths_cm]
    else:
        total = 17.0
        col_widths = [total / len(headers) * cm] * len(headers)

    cell_style = ParagraphStyle("cell", fontName="Nanum", fontSize=9, leading=12,
                                textColor=colors.black)
    cell_header = ParagraphStyle("cell_h", fontName="Nanum-Bold", fontSize=9, leading=12,
                                 textColor=WHITE, alignment=TA_CENTER)

    wrapped = []
    for ri, row in enumerate(data):
        new_row = []
        for val in row:
            if ri == 0:
                new_row.append(Paragraph(val, cell_header))
            else:
                new_row.append(Paragraph(val, cell_style))
        wrapped.append(new_row)

    tbl = Table(wrapped, colWidths=col_widths, repeatRows=1)
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CCCCCC")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    tbl.hAlign = "CENTER"
    return tbl


def build() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        leftMargin=2.0 * cm,
        rightMargin=2.0 * cm,
        title="AI-MBTI IR/PR",
        author="AI-MBTI Team",
    )

    story = []

    # ─────────────── 표지 ───────────────
    story.append(Spacer(1, 3 * cm))
    logo = fit_image("Adv/로고 및 참조/로고_transparent.png", 8, 5)
    if logo:
        logo.hAlign = "CENTER"
        story.append(logo)
    story.append(Spacer(1, 1.2 * cm))
    story.append(P("AI-MBTI", "title_xl"))
    story.append(P("AI 시대 생존력 진단 서비스", "title_sub"))
    story.append(Spacer(1, 0.8 * cm))
    story.append(P("20문항으로 진단하는 16가지 AI 활용 유형 · 데이터 드리븐 마케팅", "tagline"))
    story.append(Spacer(1, 5 * cm))
    story.append(P("IR / PR Deck · mcodegc.com · 2026.04", "meta_footer"))
    story.append(PageBreak())

    # ─────────────── 01. 서비스 개요 ───────────────
    story.append(P("01. 서비스 개요", "h1"))
    story.append(P(
        "AI-MBTI는 사용자의 AI 활용 성향을 20문항으로 진단하여 16가지 유형 중 하나로 분류하고, "
        "유형별 맞춤 학습·부트캠프 경로를 제안하는 진단 서비스입니다. 2026년 4월 기준 mcodegc.com에서 "
        "운영 중이며, Next.js 16 · React 19 · Supabase 기반으로 구축되었습니다.",
        "body_lg",
    ))

    story.append(P("■ 핵심 플로우", "h2"))
    story.append(bullets([
        "/test — 20문항 응답 수집 (5차원 점수제, A~E 각 0-4점)",
        "/analyzing — 프로그레스바 + Supabase 결과 저장 병렬 실행",
        "/result/[id] — 16유형 중 하나 판정 + 부트캠프·이북·오픈챗 CTA",
    ]))

    story.append(P("■ 유형 산출 로직 (5차원 → 4축 변환)", "h2"))
    story.append(data_table(
        ["차원", "축", "변환 기준"],
        [
            ["A + B 합산", "AI 활용 (A / S)", "합산 ≥ 5 → A (AI Native)"],
            ["C", "업무방식 (H / T)", "≥ 3 → H (Human-centric)"],
            ["D", "강점 (L / C)", "≥ 3 → L (Leading)"],
            ["E", "실행력 (F / P)", "≥ 3 → F (Fast)"],
        ],
        col_widths_cm=[3.5, 5.0, 8.5],
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(P("최종 TypeCode 예: AHLF, ATLP, SHCP … (2 × 2 × 2 × 2 = 16유형)", "small_gray"))

    story.append(P("■ 16유형 캐릭터 시스템", "h2"))
    story.extend(image_row([
        ("characters/AI 팀장.png", "AHLF · AI 팀장"),
        ("characters/LLM 설계자.png", "AHCF · LLM 설계자"),
        ("characters/DE 전략가.png", "SHLF · DE 전략가"),
    ], total_w_cm=16, max_h_cm=5.5))

    story.append(PageBreak())

    # ─────────────── 02. 마케팅 실행 ───────────────
    story.append(P("02. 마케팅 실행 현황", "h1"))
    story.append(P(
        "AI-MBTI는 Meta Ads 중심의 퍼포먼스 마케팅을 전개하고 있으며, 소재별 A/B/C 테스트와 "
        "성별 타겟팅 이원화를 통해 CPL을 최적화하고 있습니다.",
        "body_lg",
    ))

    story.append(P("① Instagram 피드 광고 — 성별 타겟팅 이원화", "h2"))
    story.extend(image_row([
        ("Adv/여자/사무실 여자 완성.png", "여성 타겟 소재"),
        ("Adv/남자/사무실 남자 완성.png", "남성 타겟 소재"),
    ], total_w_cm=14, max_h_cm=6.5))
    story.append(Spacer(1, 2 * mm))
    story.append(bullets([
        "직장인의 사무실 상황을 시각화하여 공감도 극대화 — 타겟의 일상에 자연스럽게 침투",
        "여성·남성 소재를 분리 제작하여 Meta Ads 오디언스별 전환율을 독립 측정",
        "동일 메시지·다른 비주얼 구조로 소재 피로도를 분산시키고 A/B 최적점을 탐색",
        "9:16(스토리) · 1:1(피드) · 1.91:1(가로) 3개 규격 동시 운영으로 전 지면 커버",
        "최근 7일 기준 CTR 3.5%대 달성 (업계 평균 1.8~2.0% 대비 약 1.8배)",
    ]))

    story.append(P("② 감정 소구 — Fear 캠페인", "h2"))
    story.extend(centered_image("screen/fear/fear.png", max_w_cm=11, max_h_cm=7,
                                caption="AIMBTI-fear-20260422 소재"))
    story.append(bullets([
        "“AI한테 내 일 뺏길까?” — 직장인의 AI 대체 공포를 직접적으로 자극하는 카피",
        "Simple·Social 소재 대비 클릭 유도력 검증 목적의 실험 캠페인",
        "클릭은 발생하나 Lead 전환 0건 — 공포 소구의 한계 데이터 포인트 확보",
        "48시간 내 개선 또는 중단 판단 기준 마련 (데이터 기반 소재 라이프사이클 운영)",
        "동일 예산 범위 내에서 Simple 소재로 재배분 → 전체 CPL 감소 효과",
    ]))

    story.append(PageBreak())

    story.append(P("③ 랜딩페이지 버전 A/B/C 테스트", "h2"))
    story.extend(image_row([
        ("landing/v1/full.png", "랜딩 v1"),
        ("landing/v3/full.png", "랜딩 v3"),
        ("landing/v4/full.png", "랜딩 v4 (모바일 최적화)"),
    ], total_w_cm=16, max_h_cm=7.5))
    story.append(Spacer(1, 2 * mm))
    story.append(bullets([
        "동일 트래픽 소스에 대해 랜딩 3버전을 병행 운영, test_start 전환율을 실시간 비교",
        "v4에서 모바일 우선 레이아웃 및 CTA 위치 개선 → 테스트 시작율 유의미 상승",
        "버전별 URL은 UTM 파라미터로 구분, GA4 + Supabase 이중 이벤트로 교차 검증",
        "소재(Ad)와 랜딩(LP)을 분리 실험하여 퍼널 각 단계의 기여도를 독립 측정",
        "주 1회 리뷰 사이클로 하위 성과 버전을 정리·대체 (지속적 이터레이션)",
    ]))

    story.append(P("④ 콘텐츠 기반 오가닉 유입 (zunza 시리즈)", "h2"))
    story.extend(image_row([
        ("zunza/AISERVICE/1.png", "AI 서비스 소개"),
        ("zunza/DA/1.png", "DA 콘텐츠"),
        ("zunza/AILLM/1.png", "AI·LLM 콘텐츠"),
    ], total_w_cm=16, max_h_cm=5.5))
    story.append(Spacer(1, 2 * mm))
    story.append(bullets([
        "유형별 캐릭터 IP를 활용한 인스타그램 카드뉴스 제작 — 오가닉 도달 강화",
        "진단 완료자에게 유형 캐릭터 이미지 공유 기능 제공 → 바이럴 루프 설계",
        "Meta 유료 광고와 오가닉 콘텐츠의 메시지·톤앤매너 일관성 유지",
        "콘텐츠 시리즈별 조회수·저장수 데이터를 Supabase 이벤트로 연동 관측",
        "캐릭터 IP 자산화로 추후 굿즈·캠페인 2차 활용 가능성 확보",
    ]))

    story.append(PageBreak())

    # ─────────────── 03. 데이터 대시보드 (핵심) ───────────────
    story.append(P("03. 데이터 대시보드 — 의사결정의 중심", "h1"))
    story.append(P(
        "AI-MBTI는 GA4 · Meta Ads API · Supabase를 단일 대시보드로 통합하여, "
        "모든 마케팅 의사결정을 수치에 근거하여 수행합니다. 내부 대시보드 4종을 운영 중이며, "
        "캠페인 단위부터 개별 유저 퍼널까지 drill-down 분석이 가능합니다.",
        "body_lg",
    ))

    story.append(P("■ 통합 대시보드 v3 — 종합 뷰", "h2"))
    story.extend(centered_image("screen/dashboard3.png", max_w_cm=16, max_h_cm=11,
                                caption="퍼널 · 광고 성과 · 진단 통합 (2026-03-03 ~ 2026-04-23)"))
    story.append(P(
        "총 방문 4,339 · 2차 전환 390 (E2E 8.99%) · 유효 CPA ₩599 · 전자책 수강 88. "
        "Meta + Google 통합 CPC ₩57, 총 광고비 ₩233,545. "
        "진단 엔진이 퍼널 단계별 이탈률을 자동 분석하여 위험·주의·양호 라벨을 실시간 표시합니다.",
        "body",
    ))

    story.append(PageBreak())
    story.append(P("■ 퍼널 분석 뷰 — 단계별 이탈 원인 자동 진단", "h2"))
    story.extend(centered_image("screen/dashboard3-funnel.png", max_w_cm=16, max_h_cm=12,
                                caption="Unbounce 2024 · WordStream 2025 · LeadQuizzes 벤치마크 내장 비교"))
    story.append(P(
        "방문→CTA 27.6% (업계 평균 40% 대비 -31%, 3,144명 이탈) · CTA→테스트 91.0% (+1%) · "
        "테스트→완료 95.7% (+37%) · 완료→결과 93.9% (-1%) · 결과→2차 전환 39.8% (+398%). "
        "업계 평균을 내장 상수로 보관하여 실시간 자동 비교·경고.",
        "body",
    ))

    story.append(PageBreak())
    story.append(P("■ Meta Ads 뷰 — 캠페인별 소재 성과", "h2"))
    story.extend(centered_image("screen/dashboard3-meta.png", max_w_cm=16, max_h_cm=12,
                                caption="지출·노출·클릭·CTR·CPC·CPM·전환·CVR 8개 KPI 통합"))
    story.append(P(
        "활성 3개 소재 기준 지출 ₩88,564 · CTR 3.04% · CPC ₩560 · "
        "Lead 15 · CPL ₩5,904. 캠페인 단위(simple · social · fear) drill-down 가능, "
        "Meta Pixel Lead 이벤트 기반으로 소재별 실구매 전환 직접 비교.",
        "body",
    ))

    story.append(P("■ A/B 테스트 뷰 — 랜딩·소재 변형 실시간 비교", "h2"))
    story.extend(centered_image("screen/dashboard3-abtest.png", max_w_cm=16, max_h_cm=10,
                                caption="변형별 PV · CTA · 테스트 · 2차 전환을 단일 테이블로 비교"))
    story.append(P(
        "A/B/C 변형을 동일 기간 내 독립 집계하여 전환율 차이를 정량 비교. "
        "Supabase events의 landing_version · ad_variant 디멘션을 기준으로 분리, "
        "유의미한 차이가 나오면 즉시 예산 재배분 판단.",
        "body",
    ))

    story.append(P("■ 대시보드 4종 구성", "h2"))
    story.append(data_table(
        ["대시보드", "경로", "핵심 지표"],
        [
            ["Overview", "/dashboard2/overview", "전체 KPI · 일별 트래픽 · Lead 추이"],
            ["Funnel", "/dashboard2/funnel", "page_view → test_start → result_view 전환율"],
            ["Meta Ads", "/dashboard2/meta", "캠페인별 노출·클릭·CPL·Lead (Graph API)"],
            ["Google Ads", "/dashboard2/google", "GA4 Data API 기반 UTM 소스 성과"],
            ["A/B Test", "/dashboard2/ab-test", "Meta 3-캠페인 A/B/C 실시간 비교"],
            ["Mobile", "/dashboard4", "출퇴근 중 모바일 모니터링 전용 뷰"],
        ],
        col_widths_cm=[3.0, 4.5, 9.5],
    ))

    story.append(P("■ 이벤트 이중 트래킹 아키텍처", "h2"))
    story.append(P(
        "GA4 gtag와 Supabase events 테이블에 동일 이벤트를 병렬 기록 → 신뢰도·재현성 확보.",
        "body",
    ))
    story.append(bullets([
        "추적 이벤트: page_view · test_start · test_complete · result_view · openchat_click · ebook_click",
        "Meta Pixel Lead 이벤트는 결과 페이지 CTA 3종에서 발화 (ebook_unlock · ebook_download · openchat)",
        "Clarity 히트맵·세션리코딩으로 정성 데이터 보완 → 정량+정성 크로스체크",
    ]))

    story.append(PageBreak())

    # ─────────────── 04. 성과 요약 ───────────────
    story.append(P("04. 성과 요약", "h1"))
    story.append(P("(2026-03-03 ~ 2026-04-23 · 52일 누적 · Meta Ads API 실시간)", "small_gray"))

    story.append(P("■ 캠페인별 Lead 성과 (Meta Pixel Lead · 세션당 1회 발사 · 활성 3개 캠페인)", "h2"))
    story.append(data_table(
        ["캠페인", "CTR", "CPC", "비용", "Lead", "CPL"],
        [
            ["AIMBTI-simple-v2 (최우수)", "2.96%", "₩494", "₩28,155", "7", "₩4,022"],
            ["AIMBTI-social-v2", "3.54%", "₩563", "₩28,699", "7", "₩4,099"],
            ["AIMBTI-fear-v2", "2.73%", "₩634", "₩31,710", "1", "₩31,710"],
            ["합계 (활성 3개)", "3.04%", "₩560", "₩88,564", "15", "₩5,904"],
        ],
        col_widths_cm=[4.5, 1.8, 2.0, 3.0, 1.8, 2.5],
    ))

    story.append(P("■ 핵심 인사이트", "h2"))
    story.append(bullets([
        "Simple 소재: CPL ₩4,022 · CTR 2.96% — 현재 최우수, 예산 집중 배분",
        "Social 소재: CPL ₩4,099 · CTR 3.54% — Simple과 거의 동률, 안정적",
        "Fear 소재: Lead 1건 · CPL ₩31,710 — 감정 소구 한계 검증 후 조기 정지 판단",
        "평균 CTR 3.04% — Meta 업계 평균(1.91%) 대비 59% 우수 (WordStream 2024 기준)",
        "Meta Pixel Lead는 세션당 1회만 발사하도록 설계 — Ads Manager 수치와 일치",
    ]))

    story.append(PageBreak())

    # ─────────────── 05. 로드맵 ───────────────
    story.append(P("05. 로드맵", "h1"))

    story.append(P("■ 단기 (2026 Q2)", "h2"))
    story.append(bullets([
        "Meta 3-캠페인 A/B/C 소재 고도화 및 Simple 소재 예산 확대",
        "랜딩페이지 v5 제작 — v4 데이터 기반 CTA 재배치",
        "결과 페이지 CTA 전환율 개선 (이북 언락 플로우 UX 개선)",
    ]))

    story.append(P("■ 중기 (2026 Q3~Q4)", "h2"))
    story.append(bullets([
        "유형별 부트캠프·이북 콘텐츠 상품 확장",
        "B2B 기업 진단 프로덕트 — 팀 단위 AI 역량 분석 대시보드",
        "캐릭터 IP 기반 오가닉 콘텐츠 시리즈 정규화 (주간 발행)",
    ]))

    story.append(P("■ 장기", "h2"))
    story.append(bullets([
        "영문·일문 버전 출시 → 글로벌 AI 교육 시장 진입",
        "진단 데이터 기반 AI 역량 벤치마크 리포트 발간",
        "기업 HR·L&D 부서 대상 SaaS 대시보드 별도 상품화",
    ]))

    story.append(Spacer(1, 1 * cm))
    story.append(P("Contact", "h1"))
    story.append(P("서비스: https://mcodegc.com", "body_lg"))
    story.append(P("IR / PR 문의: 내부 담당자 경유", "small_gray"))

    doc.build(story)
    print(f"✓ 생성 완료: {OUT}")
    print(f"  크기: {OUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    build()
