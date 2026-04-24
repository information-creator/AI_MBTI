"""AI-MBTI IR/PR v2 — 기업 대외 제출용 PDF.

v1 대비 차이:
  · 표지: 히어로 카피 + 핵심 지표 3개 큰 숫자
  · 섹션 컬러바 헤더 (네이비 블록)
  · KPI Highlight 카드 블록
  · 텍스트 최소화 · 여백 확대 · 이미지 크게
  · "Before vs Now" 비교 섹션 포함 (대표 미팅 소구)
  · 업계 벤치마크 비교 테이블

실행: python3 scripts/build_ir_v2_pdf.py
출력: docs/IR_AI-MBTI_v2.pdf
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
OUT = ROOT / "docs" / "IR_AI-MBTI_v2.pdf"

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
        title="AI-MBTI IR/PR v2",
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
        ("광고비", "₩88,813", "Meta 활성 3개 · 2일간"),
        ("잠재고객", "17명", "중복 제거 기준"),
        ("1명 확보 비용", "₩4,030", "업계 대비 1/6 수준"),
    ], total_w_cm=16))

    story.append(Spacer(1, 2.5 * cm))
    story.append(P("IR / PR Deck v2 · 2026.04 · mcodegc.com", "hero_meta"))
    story.append(PageBreak())

    # ════════════════════════════════════════
    # 01. 성과 — 숫자로 보는 현재
    # ════════════════════════════════════════
    story.extend(section_header(
        "01  성과",
        "숫자로 보는 현재",
        "2026년 4월 22일 ~ 4월 23일, Meta 광고 활성 3개 소재의 실제 집행 데이터입니다.",
    ))

    story.append(kpi_cards([
        ("광고비", "₩88,813", "2일간 집행"),
        ("잠재고객", "17명", "중복 제거 기준"),
        ("1명 확보 비용", "₩4,030", "최우수 광고 (Simple)"),
        ("평균 클릭률", "3.03%", "업계 대비 +59%"),
    ], total_w_cm=17))

    story.append(Spacer(1, 8 * mm))

    story.append(P("캠페인 구조 — 여성 이미지(고정) × 랜딩페이지 3종 A/B 테스트", "h3"))
    story.append(P(
        "광고 소재(여성 이미지)는 1종으로 통일하고, 랜딩페이지만 3종(Simple / Social / Fear)으로 "
        "분기하여 순수 랜딩 효과만 비교 · 2026-04-22 ~ 04-23 집행 데이터",
        "body",
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(data_table(
        ["캠페인 (여성 이미지 × 랜딩)", "잠재고객", "1명 확보 비용", "해석"],
        [
            ["여성 × Simple 랜딩 (1위)", "7명", "₩4,030", "클릭률 2.95% · 정보 중심 랜딩"],
            ["여성 × Social 랜딩", "7명", "₩4,121", "클릭률 3.52% 최고 · 공감형 랜딩"],
            ["여성 × Fear 랜딩 (실험)", "3명", "₩10,585", "공포 소구 랜딩, 한계 확인 후 중단 예정"],
            ["합계 (활성 3개 캠페인)", "17명", "평균 ₩5,224", "Simple·Social 랜딩 중심 운영"],
        ],
        col_widths_cm=[5.5, 2.5, 3.0, 6.0],
        highlight_rows=[1],
    ))

    story.append(Spacer(1, 6 * mm))
    story.append(P("업계 평균 대비 — 우리 광고 효율", "h3"))
    story.append(data_table(
        ["지표", "업계 평균", "우리 (활성 평균)", "차이"],
        [
            ["클릭률", "1.91%", "3.03%", "▲ +59%"],
            ["클릭당 광고비", "₩1,100", "₩562", "▼ -49%"],
            ["1명 확보 비용", "약 ₩25,000", "₩4,030 (최우수)", "▼ -84%"],
        ],
        col_widths_cm=[3.5, 4.5, 4.5, 4.5],
    ))
    story.append(P(
        "출처: WordStream 2024 Meta 광고 벤치마크 · 국내 교육·컨설팅 업종 기준. 기간: 2026-04-22 ~ 04-23.",
        "small_gray",
    ))

    story.append(PageBreak())

    # ─────────── 1페이지: Lead 분해 + 규모별 CPL ───────────
    story.append(P("Lead 17명 — 어디로 갔나? (이북 vs 단톡방, 중복 없음)", "h3"))
    story.append(data_table(
        ["캠페인", "총 Lead", "이북으로 이동", "단톡방으로 이동"],
        [
            ["Simple", "7", "7", "0"],
            ["Social", "7", "6", "1"],
            ["Fear", "3", "2", "1"],
            ["합계", "17", "15", "2"],
        ],
        col_widths_cm=[4.0, 3.5, 4.5, 4.5],
        highlight_rows=[4],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(P(
        "※ Meta Ads Manager Lead 기준 (세션당 1회 발사, 중복 제거). "
        "이북 이동 = 전자책 미리보기 끝까지 본 사람 또는 다운로드 버튼 클릭자. "
        "단톡방 이동 = 결과 페이지의 '단톡방 입장' 버튼 클릭자.",
        "small_gray",
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(bullets([
        "<b>Simple (Lead 7)</b>: 전원 이북 · 정보 소비형 유저",
        "<b>Social (Lead 7)</b>: 이북 6 + 단톡방 1 · 다양한 관여",
        "<b>Fear (Lead 3)</b>: 이북 2 + 단톡방 1 · 규모는 작으나 단톡방 전환",
        "<b>전체</b>: Lead 17 중 이북 15(88%) · 단톡방 2(12%) — 이북이 주요 전환 경로",
    ]))

    story.append(Spacer(1, 6 * mm))
    story.append(P("규모별 CPL 시뮬레이션 — Lead N명 확보 시 예상 광고비", "h3"))
    story.append(data_table(
        ["Lead 규모", "현재 CPL 기준 (₩4,030)", "실질 예산 (150%)", "해석"],
        [
            ["10명", "₩40,300", "₩60,450", "테스트 규모"],
            ["100명", "₩403,000", "₩604,500", "월 소규모 캠페인"],
            ["1,000명", "₩4,030,000", "₩6,045,000", "월 중형 캠페인"],
            ["10,000명", "₩40,300,000", "₩60,450,000", "연간 대규모 확장"],
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

    # ─────────── 2페이지: 데이터 분석 역량 + 광고 효율 비교 ───────────
    story.append(P("데이터 분석 역량 — 의사결정의 근거", "h3"))
    story.append(P(
        "단순 광고 집행이 아닌, Meta Ads Manager · GA4 · Supabase 3중 추적으로 "
        "캠페인별·첫페이지별·행동별 지표를 실시간 교차 검증합니다.",
        "body",
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(bullets([
        "<b>3중 추적 시스템</b>: Meta Ads Manager + GA4 + Supabase로 교차 검증",
        "<b>이벤트 단위 기록</b>: result_view · ebook_click(unlock/download) · openchat_click 개별 집계",
        "<b>UTM + 쿠키 체인</b>: 광고→랜딩→결과까지 캠페인별 attribution 추적",
        "<b>세션당 1회 Lead</b>: 중복 발사 제거로 Meta Ads Manager 수치와 완전 일치",
    ]))

    story.append(Spacer(1, 5 * mm))
    story.append(P("광고 효율 비교 — 업계 평균 vs 당사 (4월 22~23일)", "h3"))
    story.append(KeepTogether([
        data_table(
            ["지표", "업계 평균", "당사", "차이", "근거"],
            [
                ["CTR (클릭률)", "1.91%", "3.03%", "▲ +59%", "WordStream 2024 교육업"],
                ["CPC (클릭당 단가)", "₩1,100", "₩562", "▼ -49%", "WordStream 2024"],
                ["CPL (1명 확보 비용)", "약 ₩25,000", "₩4,030", "▼ -84%", "국내 교육·컨설팅 평균"],
                ["결과→구매 전환율", "8.0%", "39.8%", "▲ +398%", "WordStream 2025 Lead Nurture"],
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
    story.append(P("“광고를 집행하는 회사는 많으나, 데이터를 읽는 회사는 소수입니다.”", "pull_block"))

    story.append(Spacer(1, 5 * mm))
    story.append(P("“업계 평균의 1/6 비용으로 잠재고객을 확보하고 있습니다.”", "pull_block"))

    story.append(PageBreak())

    story.extend(section_header(
        "",
        "Claude 검토 결과",
        "Anthropic AI가 본 자료의 수치를 독립 검토한 종합 평가입니다.",
    ))
    story.append(P("항목별 등급", "h3"))
    story.append(data_table(
        ["항목", "점수", "평가", "근거"],
        [
            ["광고비 효율", "A+", "매우 우수", "업계 평균 대비 CPL 1/6, CTR 1.6배"],
            ["소재 다양성", "A", "우수", "3개 소재 A/B/C 병행, 감정·실용 모두 테스트"],
            ["데이터 신뢰도", "A", "우수", "Meta Pixel 세션당 1회 발사로 Ads Manager와 일치"],
            ["의사결정 속도", "B+", "양호", "실시간 대시보드 운영, 주 1회 소재 리뷰"],
            ["규모 (절대 수치)", "B", "초기 단계", "2일간 잠재고객 17명 — 예산 확대 시 규모 검증 필요"],
            ["종합", "A-", "광고 단위 경제성 입증", "규모 확대·전환율 개선이 다음 과제"],
        ],
        col_widths_cm=[3.5, 1.5, 2.5, 9.5],
        highlight_rows=[6],
    ))
    story.append(P(
        "※ Claude(Anthropic AI)가 본 자료의 수치를 독립 검토한 결과입니다.",
        "small_gray",
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════
    # 02. 한눈에 보기
    # ════════════════════════════════════════
    story.extend(section_header(
        "02  한눈에 보기",
        "서비스 요약",
        "AI-MBTI는 직장인이 AI를 얼마나 잘 활용할 수 있는지 20문항으로 진단하고, "
        "결과에 맞는 학습 경로를 제안하는 서비스입니다. 2026년 4월 기준 4,339명이 방문했습니다.",
    ))

    story.append(P("우리의 강점", "h3"))
    story.append(bullets([
        "<b>진단 시스템</b> — 20문항 답변으로 16가지 AI 활용 유형을 자동 분류",
        "<b>데이터 관리</b> — 광고·사용자 데이터를 한 화면에서 통합 관리",
        "<b>광고 운영 능력</b> — 3개 소재 비교로 업계 평균의 1/6 비용(₩4,030) 달성",
        "<b>캐릭터 자산</b> — 16유형 고유 캐릭터 보유, 굿즈·콘텐츠 확장 가능",
    ]))

    story.append(P("앞으로의 기회", "h3"))
    story.append(bullets([
        "AI 교육 시장 빠른 성장 — 직장인 AI 재교육 수요 증가",
        "기업 고객 확장 — 회사 팀 단위 AI 역량 진단 서비스 기회",
        "콘텐츠 사업 — 캐릭터 기반 굿즈·카드뉴스·커뮤니티 확장",
    ]))

    story.append(Spacer(1, 5 * mm))
    story.append(P("“광고 소재 테스트로 1명당 비용을 ₩4,030까지 낮췄습니다.”", "pull_block"))

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
        "진단 → 결과 → 학습 연결, 3단계로 구성됩니다.",
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

    story.append(P("첫 페이지 — 3가지 버전 동시 운영", "h3"))
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
        "업계 평균 출처 · 방문→시작 클릭: Unbounce 2024 Conversion Benchmark Report / "
        "시작→테스트 진입: LeadQuizzes 2024 Quiz Engagement Report / "
        "테스트 완료율: LeadQuizzes 2024 · 교육·컨설팅 업종 평균 / "
        "결과→구매·가입: WordStream 2025 Lead Nurture Benchmark (교육 SaaS).",
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
