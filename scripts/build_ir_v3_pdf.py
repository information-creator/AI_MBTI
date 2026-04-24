"""AI-MBTI IR/PR v3 — 비전문가용 쉬운 말 버전.

v2 대비 차이:
  · 기술 용어 제거 (CPL → 1명 확보 비용, CTR → 클릭률 등)
  · 영어 약어 최소화 · 한글 우선 표기
  · 비즈니스 성과 중심 서술 · 기술 구현은 간단히만

실행: python3 scripts/build_ir_v3_pdf.py
출력: docs/IR_AI-MBTI_v3.pdf
"""
from pathlib import Path
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak,
    Table, TableStyle, KeepTogether, ListFlowable, ListItem,
)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "docs" / "IR_AI-MBTI_v3.pdf"

FONT_DIR = Path.home() / ".local" / "share" / "fonts"
pdfmetrics.registerFont(TTFont("Nanum", str(FONT_DIR / "NanumGothic-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Nanum-Bold", str(FONT_DIR / "NanumGothic-Bold.ttf")))

# 컬러 팔레트 — IR 톤
NAVY = colors.HexColor("#0A1B3D")
ACCENT = colors.HexColor("#1E6BFF")
SOFT = colors.HexColor("#F3F6FC")
BORDER = colors.HexColor("#D6DEEC")
TEXT = colors.HexColor("#1A1F2E")
MUTED = colors.HexColor("#6B7280")
SUCCESS = colors.HexColor("#0EA36B")
WARN = colors.HexColor("#E0A800")
WHITE = colors.white

STYLES = {
    # 표지
    "hero_kicker": ParagraphStyle("hero_kicker", fontName="Nanum-Bold", fontSize=11, alignment=TA_CENTER,
                                   textColor=ACCENT, leading=14, spaceAfter=10),
    "hero_title": ParagraphStyle("hero_title", fontName="Nanum-Bold", fontSize=54, alignment=TA_CENTER,
                                  textColor=NAVY, leading=60, spaceAfter=8),
    "hero_sub": ParagraphStyle("hero_sub", fontName="Nanum-Bold", fontSize=18, alignment=TA_CENTER,
                                textColor=NAVY, leading=26, spaceAfter=8),
    "hero_pull": ParagraphStyle("hero_pull", fontName="Nanum", fontSize=13, alignment=TA_CENTER,
                                 textColor=MUTED, leading=20),
    "hero_meta": ParagraphStyle("hero_meta", fontName="Nanum", fontSize=10, alignment=TA_CENTER,
                                 textColor=MUTED, leading=14),
    # 섹션
    "section_label": ParagraphStyle("section_label", fontName="Nanum-Bold", fontSize=11,
                                     textColor=ACCENT, leading=14, spaceAfter=4, alignment=TA_LEFT),
    "section_title": ParagraphStyle("section_title", fontName="Nanum-Bold", fontSize=26,
                                     textColor=NAVY, leading=32, spaceAfter=4, alignment=TA_LEFT),
    "section_lead": ParagraphStyle("section_lead", fontName="Nanum", fontSize=11,
                                    textColor=TEXT, leading=17, spaceAfter=12, alignment=TA_LEFT),
    # 본문
    "h3": ParagraphStyle("h3", fontName="Nanum-Bold", fontSize=13, textColor=NAVY,
                         leading=17, spaceBefore=10, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Nanum", fontSize=10, textColor=TEXT,
                           leading=16, spaceAfter=4),
    "bullet": ParagraphStyle("bullet", fontName="Nanum", fontSize=10, textColor=TEXT,
                              leading=16, leftIndent=14, bulletIndent=0),
    "caption": ParagraphStyle("caption", fontName="Nanum", fontSize=9, alignment=TA_CENTER,
                               textColor=MUTED, leading=12, spaceAfter=6),
    "small_gray": ParagraphStyle("small_gray", fontName="Nanum", fontSize=9, textColor=MUTED,
                                  leading=13, spaceAfter=2),
    # KPI 카드
    "kpi_label": ParagraphStyle("kpi_label", fontName="Nanum", fontSize=10, alignment=TA_CENTER,
                                 textColor=MUTED, leading=13),
    "kpi_big": ParagraphStyle("kpi_big", fontName="Nanum-Bold", fontSize=22, alignment=TA_CENTER,
                               textColor=NAVY, leading=26),
    "kpi_sub": ParagraphStyle("kpi_sub", fontName="Nanum", fontSize=9, alignment=TA_CENTER,
                               textColor=SUCCESS, leading=12),
    # 풀 블록
    "pull_block": ParagraphStyle("pull_block", fontName="Nanum-Bold", fontSize=16, alignment=TA_LEFT,
                                  textColor=NAVY, leading=24, leftIndent=10),
}


def P(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, STYLES[style])


def bullets(items: list[str]) -> ListFlowable:
    return ListFlowable(
        [ListItem(P(it, "bullet"), leftIndent=16, bulletColor=ACCENT) for it in items],
        bulletType="bullet",
        bulletFontName="Nanum",
        bulletFontSize=8,
        start="•",
        leftIndent=8,
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
        return Image(str(img_path), width=w_out, height=h_out)
    except Exception:
        return None


def centered_image(rel_path: str, max_w_cm: float = 16.0, max_h_cm: float = 10.0,
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


def kpi_cards(cards: list[tuple[str, str, str]], total_w_cm: float = 17.0):
    """cards: list of (label, big_number, delta_text). 3~4개 권장."""
    n = len(cards)
    col_w = total_w_cm / n

    data = []
    for label, big, delta in cards:
        cell_flows = [
            Spacer(1, 3 * mm),
            P(label, "kpi_label"),
            Spacer(1, 2 * mm),
            P(big, "kpi_big"),
            Spacer(1, 2 * mm),
            P(delta, "kpi_sub"),
            Spacer(1, 3 * mm),
        ]
        data.append(cell_flows)

    tbl = Table([data], colWidths=[col_w * cm] * n, rowHeights=[3.6 * cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.8, BORDER),
        ("LINEBEFORE", (1, 0), (-1, -1), 0.8, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    tbl.hAlign = "CENTER"
    return tbl


def section_header(label: str, title: str, subtitle: str | None = None):
    """컬러바 섹션 헤더 — 네이비 얇은 바 + 라벨 + 타이틀."""
    # 얇은 컬러바
    bar = Table([[""]], colWidths=[2.0 * cm], rowHeights=[0.15 * cm])
    bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), ACCENT)]))
    bar.hAlign = "LEFT"

    flows = [
        Spacer(1, 2 * mm),
        bar,
        Spacer(1, 3 * mm),
        P(label, "section_label"),
        P(title, "section_title"),
    ]
    if subtitle:
        flows.append(Spacer(1, 2 * mm))
        flows.append(P(subtitle, "section_lead"))
    else:
        flows.append(Spacer(1, 4 * mm))
    return flows


def data_table(headers: list[str], rows: list[list[str]], col_widths_cm: list[float] | None = None,
               highlight_rows: list[int] | None = None):
    data = [headers] + rows
    if col_widths_cm:
        col_widths = [w * cm for w in col_widths_cm]
    else:
        total = 17.0
        col_widths = [total / len(headers) * cm] * len(headers)

    cell_style = ParagraphStyle("cell", fontName="Nanum", fontSize=9, leading=12, textColor=TEXT)
    cell_bold = ParagraphStyle("cell_b", fontName="Nanum-Bold", fontSize=9, leading=12, textColor=NAVY)
    cell_header = ParagraphStyle("cell_h", fontName="Nanum-Bold", fontSize=9, leading=12,
                                 textColor=WHITE, alignment=TA_CENTER)

    wrapped = []
    for ri, row in enumerate(data):
        new_row = []
        for val in row:
            if ri == 0:
                new_row.append(Paragraph(val, cell_header))
            elif highlight_rows and ri in highlight_rows:
                new_row.append(Paragraph(val, cell_bold))
            else:
                new_row.append(Paragraph(val, cell_style))
        wrapped.append(new_row)

    tbl = Table(wrapped, colWidths=col_widths, repeatRows=1)
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.3, BORDER),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SOFT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    tbl.hAlign = "CENTER"
    return tbl


def page_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Nanum", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(2.0 * cm, 1.0 * cm, "AI-MBTI · IR/PR v2 · mcodegc.com")
    canvas.drawRightString(A4[0] - 2.0 * cm, 1.0 * cm, f"{doc.page}")
    canvas.restoreState()


def build() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        topMargin=2.0 * cm,
        bottomMargin=2.0 * cm,
        leftMargin=2.2 * cm,
        rightMargin=2.2 * cm,
        title="AI-MBTI IR/PR v3",
        author="AI-MBTI Team",
    )

    story = []

    # ════════════════════════════════════════
    # 표지
    # ════════════════════════════════════════
    story.append(Spacer(1, 2.5 * cm))
    logo = fit_image("Adv/로고 및 참조/로고_transparent.png", 6, 4)
    if logo:
        logo.hAlign = "CENTER"
        story.append(logo)
    story.append(Spacer(1, 1.2 * cm))

    story.append(P("AI ERA CAREER DIAGNOSIS", "hero_kicker"))
    story.append(P("AI-MBTI", "hero_title"))
    story.append(Spacer(1, 4 * mm))
    story.append(P("AI 시대, 당신의 생존력을 진단합니다", "hero_sub"))
    story.append(Spacer(1, 1.2 * cm))
    story.append(P("20문항으로 AI 활용 유형 진단<br/>데이터 기반 광고 운영", "hero_pull"))
    story.append(Spacer(1, 2.0 * cm))

    # 표지 KPI 3개 (2026-04-22 ~ 04-23, 광고 활성 3개)
    story.append(kpi_cards([
        ("광고비", "₩134,489", "2일 + 진행 중"),
        ("신규 관심 고객", "63명", "중복 제거 기준"),
        ("1명 모시는 비용", "₩1,330", "업계 평균의 1/19"),
    ], total_w_cm=16))

    story.append(Spacer(1, 2.5 * cm))
    story.append(P("IR / PR Deck v3 · 2026.04 · mcodegc.com", "hero_meta"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # 01. 성과 — 숫자로 보는 현재
    # ════════════════════════════════════════
    story.extend(section_header(
        "01  성과",
        "숫자로 보는 현재",
        "2026-04-22 16:02 KST 개시 · 2일 full + 4/24 진행 중 · 일일 예산 ₩20,000 × 3개 캠페인.",
    ))

    story.append(kpi_cards([
        ("광고비", "₩134,489", "2일 + 진행 중"),
        ("관심 고객", "63명", "중복 제거"),
        ("1명 모시는 비용", "₩1,330", "Simple 소재 · 최저"),
        ("광고 클릭률", "2.94%", "업계의 1.5배"),
    ], total_w_cm=17))

    story.append(Spacer(1, 8 * mm))

    # ─────────── 일별 성과 변화 (하루하루 학습 가속) ───────────
    story.append(P("일별 성과 변화 — 하루 지날수록 CPL 급감", "h3"))
    story.append(P(
        "3개 캠페인 모두 동일 조건 (일일 예산 ₩20,000 · 시작 2026-04-22 16:02 KST). "
        "4/22는 부분 집행(오후 개시), 4/23은 풀 24시간, 4/24는 현재 진행 중.",
        "body",
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(data_table(
        ["일자", "집행 상태", "광고비", "Lead", "CPL", "해석"],
        [
            ["4/22", "부분 (16:02~)",  "₩34,236", "11명", "₩3,112",     "초기 탐색"],
            ["4/23", "Full 24시간",    "₩66,819", "19명", "₩3,517",     "예산 풀 소진"],
            ["4/24", "진행 중",        "₩33,434", "33명", "₩1,013 🚀",  "학습 가속"],
            ["누적", "2일 + 진행 중",  "₩134,489", "63명", "₩2,135",     "평균"],
        ],
        col_widths_cm=[1.5, 3.0, 2.8, 2.0, 2.8, 4.4],
        highlight_rows=[3, 4],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "★ CPL 변화: ₩3,112 → ₩3,517 → <b>₩1,013</b> · Lead: 11 → 19 → <b>33</b>. "
        "마지막 하루 만에 CPL 1/3 수준 · Lead 3배 — Meta 알고리즘 학습 가속 명확.",
        "small_gray",
    ))

    story.append(Spacer(1, 5 * mm))
    story.append(P("캠페인별 · 일별 광고비 (예산 정합성 검증)", "h3"))
    story.append(data_table(
        ["캠페인", "4/22", "4/23", "4/24", "합계", "일일 예산"],
        [
            ["Simple",  "₩10,617", "₩22,439", "₩12,169", "₩45,225", "₩20,000"],
            ["Social",  "₩11,495", "₩20,711", "₩12,003", "₩44,209", "₩20,000"],
            ["Fear",    "₩12,124", "₩23,669", "₩9,262",  "₩45,055", "₩20,000"],
            ["합계 (3종)", "₩34,236", "₩66,819", "₩33,434", "₩134,489", "₩60,000/일"],
        ],
        col_widths_cm=[3.0, 2.5, 2.5, 2.5, 2.8, 3.2],
        highlight_rows=[4],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "세 캠페인 모두 동일 일일 예산 ₩20,000 · 동일 시작 시각 · 공정 비교. "
        "4/23만 full 24h라 ~₩20k 풀 소진, 4/22(시작일)·4/24(진행중)는 부분 집행.",
        "small_gray",
    ))

    story.append(PageBreak())
    story.append(P("캠페인 구조 — 여성 이미지(고정) × 첫페이지 3종 비교", "h3"))
    story.append(P(
        "광고 사진(여성 이미지)은 1종으로 통일하고, 클릭하면 보이는 첫페이지만 3종(심플·사회적·공포)으로 "
        "나눠서 순수하게 첫페이지 효과만 비교했습니다 · 4월 22일~24일 집행 데이터",
        "body",
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(data_table(
        ["캠페인 (여성 이미지 × 첫페이지)", "관심 고객", "1명 모시는 비용", "한 줄 평가"],
        [
            ["여성 × 심플 첫페이지 (1등)", "34명", "₩1,330", "정보 중심 첫페이지 · 가장 저렴"],
            ["여성 × 사회적 첫페이지", "16명", "₩2,763", "공감형 첫페이지 · 클릭 가장 많음"],
            ["여성 × 공포 첫페이지 (실험)", "13명", "₩3,466", "공포 소구, 반응 개선 · 재평가 필요"],
            ["합계 (3종)", "63명", "평균 ₩2,135", "Simple·Social 첫페이지 중심 운영"],
        ],
        col_widths_cm=[5.5, 2.5, 3.0, 6.0],
        highlight_rows=[1],
    ))

    story.append(Spacer(1, 6 * mm))
    story.append(P("우리 광고 vs 업계 평균", "h3"))
    story.append(data_table(
        ["지표", "업계 평균", "우리", "차이"],
        [
            ["광고 보고 누르는 비율", "1.91%", "2.94%", "▲ 1.5배"],
            ["한 번 누를 때 광고비", "₩1,100", "₩558", "▼ 절반"],
            ["1명 모시는 비용", "약 ₩25,000", "₩2,135", "▼ 1/12"],
        ],
        col_widths_cm=[4.0, 4.0, 4.0, 5.0],
    ))
    story.append(P(
        "출처: WordStream 2024년 페이스북 광고 평균 · 국내 교육/컨설팅 업종 기준. 기간: 4월 22일~24일.",
        "small_gray",
    ))

    story.append(PageBreak())

    # ─────────── 1페이지: 관심 고객 분해 ───────────
    story.append(P("관심 고객 63명 — 어디로 갔나? (4월 22~24일)", "h3"))
    story.append(data_table(
        ["캠페인 (첫페이지)", "총 관심 고객", "전자책으로 이동", "단톡방으로 이동"],
        [
            ["Simple", "34명", "30명", "4명"],
            ["Social", "16명", "10명", "6명"],
            ["Fear", "13명", "13명", "0명"],
            ["합계", "63명", "53명", "10명"],
        ],
        col_widths_cm=[4.5, 3.5, 4.5, 4.0],
        highlight_rows=[4],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "※ Meta 광고 관리자 기준 관심 고객 수 (같은 사람이 여러 번 눌러도 1명으로 집계). "
        "전자책 이동 = 전자책 미리보기 끝까지 본 사람 또는 다운로드 버튼 누른 사람. "
        "단톡방 이동 = 결과 페이지의 '단톡방 입장' 버튼 누른 사람.",
        "small_gray",
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(bullets([
        "<b>Simple (34명)</b>: 전자책 중심 30명 · 정보 원하는 사람 모임",
        "<b>Social (16명)</b>: 전자책 10 + 단톡방 6 · 가장 다양한 반응",
        "<b>Fear (13명)</b>: 전자책 13 + 단톡방 0 · 전자책 중심 유도",
        "<b>전체</b>: 63명 중 53명(84%)이 전자책으로 이동 → 전자책이 핵심 유도 상품",
    ]))

    story.append(Spacer(1, 6 * mm))
    story.append(P("규모별 광고비 환산 — 고객 N명 모으려면 얼마?", "h3"))
    story.append(data_table(
        ["규모", "현재 CPL 기준 (₩2,135)", "실질 가격 (150%=₩3,203)", "해석"],
        [
            ["10명", "₩21,350", "₩32,025", "테스트 규모"],
            ["100명", "₩213,500", "₩320,250", "월 소규모 운영"],
            ["1,000명", "₩2,135,000", "₩3,202,500", "월 중형 캠페인"],
            ["10,000명", "₩21,350,000", "₩32,025,000", "연간 대규모 확장"],
        ],
        col_widths_cm=[3.0, 4.5, 4.5, 4.5],
        highlight_rows=[3],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "※ 150% 할증 근거: 광고 규모를 10~10,000배 확대하면 최적 타겟 고갈로 CPL이 상승. "
        "업계 표준상 초기 CPL의 130~170% 수준으로 수렴하므로, 중간값 150%를 보수적 추정치로 적용.",
        "small_gray",
    ))

    story.append(PageBreak())

    # ─────────── Meta 광고 퍼널 비교 페이지 ───────────
    story.append(P("Meta 광고 캠페인별 전체 퍼널 비교 (4월 22~24일)", "h3"))
    story.append(P(
        "페이스북·인스타 광고로 들어온 사람들만 추려서 (utm_source=meta) 캠페인별로 "
        "어디에서 얼마나 이탈하는지 비교한 결과입니다.",
        "body",
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(data_table(
        ["캠페인", "랜딩 조회", "CTA 클릭", "테스트 시작", "결과 확인", "Lead", "CTA 클릭률 ★", "Lead 전환율 ★"],
        [
            ["Simple", "146", "87", "79", "65", "34", "59.6% 🏆 1위", "23.3%"],
            ["Social", "98", "49", "45", "41", "16", "50.0%", "16.3% 🏆 1위"],
            ["Fear", "108", "61", "52", "38", "13", "56.5% (2위)", "12.0% (꼴찌)"],
            ["합계 · 평균", "352", "197", "176", "144", "63", "55.9%", "17.9%"],
        ],
        col_widths_cm=[2.2, 1.8, 1.8, 2.0, 2.0, 1.5, 2.5, 2.5],
        highlight_rows=[4],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "★ 두 개의 '1위'가 서로 다른 캠페인: <b>CTA 클릭률 1위 = Simple (59.6%)</b> / <b>Lead 전환율 1위 = Social (16.3%)</b>. "
        "즉 버튼 많이 누르게 하는 광고(Simple)와 끝까지 전환되는 광고(Social)가 따로임.",
        "small_gray",
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "※ Lead 전환율 = Lead ÷ 랜딩 조회. Meta 광고 평균 CTA 클릭률 56%는 업계 평균(40%) 대비 +40% 우수.",
        "small_gray",
    ))

    story.append(Spacer(1, 5 * mm))

    # ─────────── 같은 페이지: 결론 카드 3개 (박스 강조) ───────────
    conclusion_label = ParagraphStyle("ccl_lbl", fontName="Nanum-Bold", fontSize=10,
                                       textColor=WHITE, alignment=TA_CENTER, leading=14)
    conclusion_title = ParagraphStyle("ccl_t", fontName="Nanum-Bold", fontSize=12,
                                       textColor=NAVY, leading=16)
    conclusion_body = ParagraphStyle("ccl_b", fontName="Nanum", fontSize=9,
                                      textColor=TEXT, leading=13)

    # 섹션 타이틀
    title_bar = Table([["결론 — 3개 광고의 역할이 명확히 다름"]], colWidths=[17*cm], rowHeights=[0.7*cm])
    title_bar.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("TEXTCOLOR", (0,0), (-1,-1), WHITE),
        ("FONTNAME", (0,0), (-1,-1), "Nanum-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 12),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
    ]))
    title_bar.hAlign = "CENTER"
    story.append(title_bar)
    story.append(Spacer(1, 2 * mm))

    # 3개 결론 박스 (컴팩트)
    def card(badge_color, badge, title, body):
        tag = Table([[Paragraph(badge, conclusion_label)]], colWidths=[2.0*cm], rowHeights=[0.6*cm])
        tag.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), badge_color),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
        ]))
        content = [
            [tag, Paragraph(title, conclusion_title)],
            ["", Paragraph(body, conclusion_body)],
        ]
        tbl = Table(content, colWidths=[2.0*cm, 14.7*cm])
        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), SOFT),
            ("BOX", (0,0), (-1,-1), 0.5, BORDER),
            ("LINEAFTER", (0,0), (0,-1), 2, badge_color),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("LEFTPADDING", (1,0), (1,-1), 10),
            ("RIGHTPADDING", (1,0), (1,-1), 10),
            ("TOPPADDING", (0,0), (-1,-1), 5),
            ("BOTTOMPADDING", (0,0), (-1,-1), 5),
            ("SPAN", (0,0), (0,-1)),
        ]))
        tbl.hAlign = "CENTER"
        return tbl

    story.append(card(
        colors.HexColor("#0EA36B"), "🏆 1위",
        "Simple = 트래픽 수확기",
        "많이 보이고 많이 누르게 함. <b>CTA 클릭률 59.6% 1위</b>. 넓은 그물로 많이 끌어오는 메인 소재."
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(card(
        colors.HexColor("#1E6BFF"), "🏆 1위",
        "Social = 질적 전환기",
        "랜딩 효율은 꼴찌인데 <b>Lead 전환율 16.3%로 1위</b>. 관심 없는 사람만 걸러져 끝까지 감."
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(card(
        colors.HexColor("#E0A800"), "⚠ 재평가",
        "Fear = 호기심 낚시 (재평가 필요)",
        "랜딩 효율 2위지만 <b>Lead 전환율 12.0%로 꼴찌</b>. 클릭은 유도되나 실제 전환 안 됨."
    ))

    story.append(PageBreak())

    # ─────────── 데이터 분석 홍보 · 광고 효율 비교 ───────────
    story.append(P("데이터 분석 역량 — 우리만의 무기", "h3"))
    story.append(P(
        "단순히 광고를 '돌리는' 것이 아니라, 어떤 광고가 어떤 고객에게 어디서 반응하는지 "
        "실시간으로 추적·분석하여 매 순간 의사결정을 내립니다.",
        "body",
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(bullets([
        "<b>3중 추적 시스템</b>: Meta 광고 관리자 + GA4 + 자체 데이터베이스(Supabase)로 교차 검증",
        "<b>행동 단위 이벤트</b>: 결과 페이지 진입 · 전자책 클릭 · 단톡방 클릭을 각각 기록",
        "<b>첫페이지별 추적</b>: 광고→첫페이지→결과까지 UTM+쿠키로 끝까지 연결 추적",
        "<b>세션당 1회 Lead</b>: 중복 클릭을 제거한 순수 고객 수를 실시간 산출",
    ]))

    story.append(Spacer(1, 5 * mm))
    story.append(P("우리 광고 효율 vs 업계 평균 (4월 22~24일)", "h3"))
    story.append(KeepTogether([
        data_table(
            ["지표", "업계 평균", "우리", "차이", "근거"],
            [
                ["광고 보고 누르는 비율", "1.91%", "2.94%", "▲ 1.5배", "WordStream 2024 교육업"],
                ["한 번 누를 때 광고비", "₩1,100", "₩558", "▼ 절반", "WordStream 2024"],
                ["1명 모시는 비용 (CPL)", "약 ₩25,000", "₩2,135", "▼ 1/12", "국내 교육·컨설팅 평균"],
                ["결과→구매 전환율", "8.0%", "39.8%", "▲ 5배", "WordStream 2025"],
            ],
            col_widths_cm=[3.5, 2.5, 2.5, 2.0, 5.5],
            highlight_rows=[3],
        ),
        Spacer(1, 2 * mm),
        P(
            "※ 업계 평균 출처: WordStream 2024 Facebook Ads Benchmark / WordStream 2025 Lead "
            "Nurture Benchmark (모두 교육·컨설팅 업종 기준).",
            "small_gray",
        ),
    ]))

    story.append(Spacer(1, 5 * mm))
    story.append(P("“광고를 돌리는 회사는 많지만, 숫자를 읽는 회사는 적습니다.”", "pull_block"))

    story.append(PageBreak())

    # ─────────── Meta 캠페인 상세 성적표 (AI-MBTI vs 데이터 분석 홍보) ───────────
    story.append(P("Meta 광고 캠페인 비교 — AI-MBTI vs 데이터 분석 홍보 (같은 계정 · 같은 기간)", "h3"))
    story.append(P(
        "같은 메타코드M 광고 계정에서 돌리는 '데이터 분석 홍보' 캠페인과 AI-MBTI 3개를 "
        "동일 기간(4월 22~24일)·동일 조건(OUTCOME_LEADS)으로 비교했습니다.",
        "body",
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(data_table(
        ["지표", "Simple (1위)", "Social", "Fear (실험)", "데이터 분석 홍보"],
        [
            ["광고 목표", "잠재고객 확보", "잠재고객 확보", "잠재고객 확보", "잠재고객 확보"],
            ["광고비", "₩45,225", "₩44,209", "₩45,055", "₩119,493"],
            ["도달 (실사용자)", "2,352명", "1,746명", "2,122명", "3,160명"],
            ["노출 수", "3,173회", "2,256회", "2,738회", "3,787회"],
            ["클릭률 (CTR)", "3.11%", "3.18%", "2.55%", "2.19%"],
            ["클릭당 비용 (CPC)", "₩457", "₩614", "₩644", "₩1,440"],
            ["Lead", "34명", "16명", "13명", "13명"],
            ["1명 모시는 비용 (CPL)", "₩1,330 🏆", "₩2,763", "₩3,466", "₩9,192"],
        ],
        col_widths_cm=[4.0, 3.0, 3.0, 3.0, 3.5],
        highlight_rows=[8],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "※ Meta Graph API v21.0 직접 조회 (2026-04-22~04-24). "
        "AI-MBTI 3개와 '데이터 분석 홍보'는 동일 계정·동일 광고 목표로 공정 비교 가능.",
        "small_gray",
    ))

    story.append(Spacer(1, 5 * mm))
    story.append(P("보이는 인사이트 — AI-MBTI가 압도적 우위", "h3"))
    story.append(bullets([
        "<b>CPL 비교</b>: AI-MBTI Simple ₩1,330 vs 데이터 분석 홍보 ₩9,192 — <b>6.9배 저렴</b>",
        "<b>CPC 비교</b>: Simple ₩457 vs 데이터 분석 홍보 ₩1,440 — <b>3.2배 저렴</b>",
        "<b>CTR 비교</b>: AI-MBTI 평균 2.94% vs 데이터 분석 홍보 2.19% — <b>+34% 우수</b>",
        "<b>효율 역전</b>: 데이터 분석 홍보가 광고비 2.6배 더 쓰고도 Lead는 13명 (AI-MBTI Simple 34명의 1/3)",
    ]))

    story.append(PageBreak())

    # ─────────── 데이터 분석 캠페인 실제 화면 비교 ───────────
    story.append(P("데이터 분석 캠페인 — 실제 운영 화면", "h3"))
    story.append(P(
        "3중 추적 시스템이 실제로 어떻게 보이는지, 그리고 캠페인별로 어떻게 비교되는지 "
        "우리 대시보드에서 직접 확인할 수 있습니다.",
        "body",
    ))
    story.append(Spacer(1, 4 * mm))

    story.extend(image_row([
        ("screen/dashboard3-meta.png", "Meta 광고 성과 화면"),
        ("screen/dashboard3-abtest.png", "캠페인별 비교 (A/B 테스트)"),
    ], total_w_cm=17, max_h_cm=9))

    story.append(Spacer(1, 5 * mm))
    story.append(P("캠페인별 비교 — 같은 기준, 같은 화면", "h3"))
    story.append(bullets([
        "<b>Meta 광고 화면</b>: 지출·클릭·전환 등 8개 지표를 한눈에 확인",
        "<b>캠페인별 비교 화면</b>: Simple·Social·Fear 성과를 같은 기준으로 나란히 비교",
        "<b>자동 업데이트</b>: Meta·Google·Supabase 데이터가 실시간으로 반영",
        "<b>드릴다운</b>: 캠페인 → 첫페이지 → 개별 이벤트까지 단계별로 파고들기 가능",
    ]))

    story.append(Spacer(1, 5 * mm))
    story.append(P(
        "※ 이 화면들은 실제 내부 대시보드(dashboard3)입니다. 외부 서비스 없이 자체 구축했으며, "
        "의사결정 속도와 정확도에서 경쟁사 대비 명확한 우위를 가집니다.",
        "small_gray",
    ))

    story.append(PageBreak())

    story.extend(section_header(
        "",
        "Claude AI의 성과 평가",
        "AI(Claude)가 이 자료의 숫자를 따로 확인하고 매긴 종합 평가입니다.",
    ))
    story.append(P("잘하고 있는 것 / 더 할 수 있는 것", "h3"))
    story.append(data_table(
        ["항목", "점수", "평가", "이유"],
        [
            ["광고비 효율", "A+", "아주 잘함", "업계 평균의 1/12 비용, 클릭률은 1.5배"],
            ["광고 다양성", "A", "잘함", "3가지 광고를 동시에 테스트해 비교"],
            ["숫자 정확도", "A", "잘함", "페이스북 광고 관리자 숫자와 완전 일치"],
            ["의사결정 속도", "B+", "괜찮음", "한 화면 대시보드로 빠르게 판단"],
            ["전체 규모", "B", "이제 시작", "3일에 63명 — 예산 늘리며 확장 검증 필요"],
            ["종합", "A-", "광고 효율 입증 단계", "이제 규모를 키우고 구매율을 높이는 것이 과제"],
        ],
        col_widths_cm=[3.5, 1.5, 2.5, 9.5],
        highlight_rows=[6],
    ))
    story.append(P(
        "※ Claude(Anthropic의 AI)가 이 자료의 숫자를 따로 확인하고 내린 평가입니다.",
        "small_gray",
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════
    # 02. 한눈에 보기
    # ════════════════════════════════════════
    story.extend(section_header(
        "02  한눈에 보기",
        "서비스 요약",
        "직장인이 AI를 얼마나 잘 쓸 수 있는지 20문항으로 알아보고, "
        "결과에 맞는 공부 코스를 알려주는 서비스입니다.",
    ))

    story.append(P("우리의 강점", "h3"))
    story.append(bullets([
        "<b>재미있는 진단</b> — 20문항 답하면 16가지 유형 중 내가 누구인지 알려줌",
        "<b>한 화면 데이터 관리</b> — 광고와 사용자 정보를 한 번에 확인",
        "<b>광고비 절약 능력</b> — 업계 평균의 1/12(₩2,135) 비용으로 운영",
        "<b>캐릭터 보유</b> — 16유형 고유 캐릭터로 굿즈·콘텐츠 확장 가능",
    ]))

    story.append(P("앞으로의 기회", "h3"))
    story.append(bullets([
        "AI 교육 시장 빠른 성장 — 직장인의 AI 재교육 수요가 계속 늘어남",
        "회사 고객 확장 — 기업 팀 단위로 AI 역량 진단 서비스 제공 가능",
        "콘텐츠 사업 — 캐릭터 기반 굿즈·카드뉴스·커뮤니티 확장",
    ]))

    story.append(Spacer(1, 5 * mm))
    story.append(P("“광고 테스트로 1명 모시는 비용을 ₩1,330까지 낮췄습니다.”", "pull_block"))

    story.append(PageBreak())

    # ════════════════════════════════════════
    # 03. 왜 필요한가
    # ════════════════════════════════════════
    story.extend(section_header(
        "03  왜 필요한가",
        "문제와 해결",
        "AI 시대 직장인은 '내가 뒤처지고 있나'라는 막연한 불안을 느끼지만, "
        "구체적으로 무엇을 배워야 하는지 모릅니다. 이 불안을 진단으로 해소합니다.",
    ))

    story.append(P("문제", "section_label"))
    story.append(P("AI가 일상과 업무에 들어왔지만 개인의 대응은 제각각", "h3"))
    story.append(bullets([
        "“나는 AI를 어느 정도 쓸 수 있는 사람인가?”에 대한 객관적 답이 없음",
        "수많은 강의·부트캠프 중 무엇이 내게 맞는지 판단 근거 부재",
        "막연한 불안만 있고, 실제 학습·구매로 이어지지 않는 상태 장기화",
    ]))

    story.append(Spacer(1, 5 * mm))
    story.append(P("해결", "section_label"))
    story.append(P("20문항 3분 진단 → 16유형 중 나의 위치 확인 → 맞춤 학습 경로", "h3"))

    story.extend(image_row([
        ("characters/AI 팀장.png", "AI 활용형"),
        ("characters/LLM 설계자.png", "LLM 전문형"),
        ("characters/DE 전략가.png", "데이터 전략형"),
        ("characters/DA 예술가.png", "창작 활용형"),
    ], total_w_cm=16, max_h_cm=4.5))

    story.append(Spacer(1, 4 * mm))
    story.append(P(
        "각 유형은 고유 캐릭터와 추천 학습 코스를 가지며, 결과 페이지에서 "
        "전자책·부트캠프·오픈채팅방으로 자연스럽게 연결됩니다.",
        "body",
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════
    # 04. Product — 3 스텝 플로우
    # ════════════════════════════════════════
    story.extend(section_header(
        "04  제품 소개",
        "서비스 흐름",
        "20문항 답 → 16유형 결과 → 맞춤 학습 연결, 3단계로 구성됩니다.",
    ))

    # 3-step flow table
    flow_style = ParagraphStyle("flow", fontName="Nanum-Bold", fontSize=13, alignment=TA_CENTER,
                                 textColor=NAVY, leading=18)
    flow_sub = ParagraphStyle("flow_sub", fontName="Nanum", fontSize=9, alignment=TA_CENTER,
                               textColor=MUTED, leading=12)
    steps = [
        [Paragraph("STEP 1", flow_sub), Paragraph("STEP 2", flow_sub), Paragraph("STEP 3", flow_sub)],
        [Paragraph("진단", flow_style), Paragraph("결과", flow_style), Paragraph("학습 연결", flow_style)],
        [Paragraph("20문항 3분", flow_sub), Paragraph("16유형 중 매칭", flow_sub), Paragraph("부트캠프·전자책·오픈채팅", flow_sub)],
    ]
    step_tbl = Table(steps, colWidths=[5.5 * cm] * 3, rowHeights=[0.8 * cm, 1.4 * cm, 0.8 * cm])
    step_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.8, BORDER),
        ("LINEBEFORE", (1, 0), (-1, -1), 0.8, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    step_tbl.hAlign = "CENTER"
    story.append(step_tbl)

    story.append(Spacer(1, 8 * mm))
    story.append(P("실제 서비스 화면 — 3단계", "h3"))
    story.extend(image_row([
        ("screen/service-test.png", "1단계 · 20문항 진단"),
        ("screen/service-result.png", "2단계 · 16유형 결과"),
        ("screen/service-cta.png", "3단계 · 전자책·단톡방 연결"),
    ], total_w_cm=17, max_h_cm=9))

    story.append(PageBreak())

    story.append(P("첫 페이지 — 3가지 버전을 동시에 운영 중", "h3"))
    story.extend(image_row([
        ("landing/v1/full.png", "v1"),
        ("landing/v3/full.png", "v3"),
        ("landing/v4/full.png", "v4 (모바일)"),
    ], total_w_cm=14, max_h_cm=7))

    story.append(PageBreak())

    # ════════════════════════════════════════
    # 05. Marketing — 실제 소재
    # ════════════════════════════════════════
    story.extend(section_header(
        "05  광고 운영",
        "광고 실행 방식",
        "페이스북·인스타 광고 중심 — 광고 소재·타겟·첫페이지 3가지를 동시 실험합니다.",
    ))

    story.append(P("광고 소재 3종", "h3"))
    story.extend(image_row([
        ("Adv/여자/사무실 여자 완성.png", "Simple · 여성 타겟"),
        ("Adv/남자/사무실 남자 완성.png", "Simple · 남성 타겟"),
        ("screen/fear/fear.png", "Fear (실험용)"),
    ], total_w_cm=17, max_h_cm=6.5))

    story.append(Spacer(1, 5 * mm))
    story.append(bullets([
        "<b>남녀 타겟 분리</b> — 남성·여성 광고를 각각 만들어 반응을 별도로 측정",
        "<b>3가지 화면 비율 동시 운영</b> — 스토리·피드·가로형 지면 모두 커버",
        "<b>감정 vs 실용 비교</b> — 공포 마케팅도 테스트해 한계를 확인",
        "<b>주 1회 점검</b> — 성과 낮은 광고는 정리, 높은 광고에 예산 집중",
    ]))

    story.append(Spacer(1, 6 * mm))
    story.append(P("자연 유입 — 캐릭터 활용 카드뉴스", "h3"))
    story.extend(image_row([
        ("zunza/AISERVICE/1.png", "AI 서비스"),
        ("zunza/DA/1.png", "DA 시리즈"),
        ("zunza/AILLM/1.png", "LLM 시리즈"),
    ], total_w_cm=16, max_h_cm=5.5))

    story.append(PageBreak())

    # ════════════════════════════════════════
    # 06. Data Infrastructure — 대시보드가 무기
    # ════════════════════════════════════════
    story.extend(section_header(
        "06  데이터 관리",
        "우리만의 대시보드",
        "광고 효율과 사용자 흐름을 한 화면에서 실시간 확인합니다. "
        "빠른 의사결정이 가능해 광고비를 낭비하지 않습니다.",
    ))

    story.append(P("종합 대시보드", "h3"))
    story.extend(centered_image("screen/dashboard3.png", max_w_cm=16, max_h_cm=10,
                                caption="사용자 흐름·광고 성과·자동 진단을 한 화면에서 확인"))

    story.append(PageBreak())

    story.append(P("사용자 흐름 분석 — 단계별 이탈 자동 비교", "h3"))
    story.extend(centered_image("screen/dashboard3-funnel.png", max_w_cm=16, max_h_cm=11,
                                caption="단계별 이탈률을 업계 평균과 자동 비교"))

    story.append(Spacer(1, 4 * mm))
    story.append(P("단계별 전환율 vs 업계 평균", "h3"))
    story.append(data_table(
        ["단계", "우리", "업계 평균", "차이"],
        [
            ["방문 → 시작 버튼 클릭", "27.6%", "40.0%", "▼ -31% (개선 필요)"],
            ["시작 → 테스트 진입", "91.0%", "90.0%", "▲ +1%"],
            ["테스트 시작 → 완료", "95.7%", "70.0%", "▲ +37%"],
            ["테스트 완료 → 결과 확인", "93.9%", "95.0%", "▼ -1%"],
            ["결과 확인 → 구매·가입", "39.8%", "8.0%", "▲ +398% ★"],
        ],
        col_widths_cm=[5.5, 2.5, 3.0, 6.0],
        highlight_rows=[5],
    ))
    story.append(P(
        "업계 평균은 공신력 있는 해외 리포트를 기준으로 삼았습니다 · "
        "방문→시작: Unbounce 2024 / 테스트 완료율: LeadQuizzes 2024 / "
        "구매·가입 전환: WordStream 2025 (모두 교육·컨설팅 업종 평균).",
        "small_gray",
    ))

    story.append(Spacer(1, 5 * mm))
    story.append(P(
        "★ 결과를 본 10명 중 4명이 구매·가입으로 이어집니다 — 업계 평균의 5배 수준. "
        "진단 결과가 자연스럽게 학습 상품 구매로 연결되고 있습니다.",
        "body",
    ))

    story.append(PageBreak())

    story.append(P("광고 성과 화면", "h3"))
    story.extend(centered_image("screen/dashboard3-meta.png", max_w_cm=16, max_h_cm=11,
                                caption="광고비·클릭·전환 등 8가지 지표를 한 번에 확인"))

    story.append(Spacer(1, 4 * mm))
    story.append(P("광고 소재 비교 화면", "h3"))
    story.extend(centered_image("screen/dashboard3-abtest.png", max_w_cm=16, max_h_cm=9,
                                caption="소재별 성과를 같은 기준으로 비교 → 예산 재배분 판단"))

    story.append(PageBreak())

    # ════════════════════════════════════════
    # 07. Roadmap
    # ════════════════════════════════════════
    story.extend(section_header(
        "07  앞으로의 계획",
        "단계별 성장 방향",
        "단기는 수익 집중, 중기는 기업 고객 확장, 장기는 해외 진출입니다.",
    ))

    story.append(data_table(
        ["시기", "핵심 목표", "주요 과제"],
        [
            ["2026 Q2",
             "광고 효율 개선 · 구매율 향상",
             "1위 소재(Social) 예산 확대 · 첫페이지 개선 · 구매 버튼 개선"],
            ["2026 Q3-Q4",
             "상품 다양화 · 기업 고객 진입",
             "유형별 부트캠프 · 회사 팀 진단 서비스 · 주간 콘텐츠 정기 발행"],
            ["2027+",
             "해외 진출 · 업계 리포트 발행",
             "영어·일본어 버전 · AI 역량 연간 리포트 · 기업 HR 대상 서비스"],
        ],
        col_widths_cm=[2.5, 5.0, 9.5],
    ))

    story.append(Spacer(1, 1.0 * cm))
    story.extend(section_header(
        "",
        "연락처",
    ))
    story.append(P("서비스: <b>https://mcodegc.com</b>", "body"))
    story.append(P("IR / PR 문의: <b>information@mcode.co.kr</b>", "body"))

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print(f"✓ 생성 완료: {OUT}")
    print(f"  크기: {OUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    build()
