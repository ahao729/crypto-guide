from datetime import date, timedelta
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT = "public/downloads"
GOLD = "C9A227"
DARK = "1F2937"
LIGHT = "F7F3E8"
GREEN = "E8F5E9"
RED = "FDECEA"

header_font = Font(name="Microsoft YaHei", size=10, bold=True, color="FFFFFF")
body_font = Font(name="Microsoft YaHei", size=10)
small_font = Font(name="Microsoft YaHei", size=9, color="6B7280")
header_fill = PatternFill("solid", fgColor=GOLD)
section_fill = PatternFill("solid", fgColor=LIGHT)
thin = Side(style="thin", color="E5E7EB")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
center = Alignment(horizontal="center", vertical="center", wrap_text=True)
left = Alignment(horizontal="left", vertical="center", wrap_text=True)


def style_header(ws, row, cols):
    for col in range(1, cols + 1):
        c = ws.cell(row=row, column=col)
        c.font = header_font
        c.fill = header_fill
        c.alignment = center
        c.border = border


def set_widths(ws, widths):
    for idx, width in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(idx)].width = width


def instruction_sheet(wb, title, lines):
    ws = wb.create_sheet("使用说明")
    ws.sheet_view.showGridLines = False
    ws["A1"] = title
    ws["A1"].font = Font(name="Microsoft YaHei", size=16, bold=True, color=DARK)
    ws["A2"] = "最后更新：2026-10-22 · 币圈指南"
    ws["A2"].font = small_font
    ws.column_dimensions["A"].width = 100
    row = 4
    for line in lines:
        ws.cell(row=row, column=1, value=line).font = body_font
        ws.cell(row=row, column=1).alignment = left
        ws.row_dimensions[row].height = 22
        row += 1
    ws["A" + str(row + 1)] = "风险提示：模板仅用于记录与计算，不构成投资建议。加密资产价格波动较大，请自行承担风险。"
    ws["A" + str(row + 1)].font = Font(name="Microsoft YaHei", size=9, color="B45309")
    ws["A" + str(row + 1)].alignment = left
    return ws


# ── 1. Trading log ─────────────────────────────────────────────
wb = Workbook()
ws = wb.active
ws.title = "交易记录"
headers = ["日期", "交易所", "交易对", "方向", "策略", "入场价", "出场价", "数量", "手续费", "已实现盈亏", "收益率", "持仓时长(小时)", "止损价", "止盈价", "情绪", "备注"]
for i, h in enumerate(headers, 1):
    ws.cell(row=1, column=i, value=h)
style_header(ws, 1, len(headers))

examples = [
    (date(2026, 10, 1), "Binance", "BTC/USDT", "做多", "突破", 60000, 61500, 0.05, 3.0),
    (date(2026, 10, 8), "OKX", "ETH/USDT", "做空", "区间", 2500, 2420, 1.2, 2.5),
    (date(2026, 10, 15), "Bybit", "SOL/USDT", "做多", "回调", 145, 151, 20, 4.0),
]
for r, (d, ex, pair, side, strategy, entry, exit_, qty, fee) in enumerate(examples, 2):
    ws.cell(row=r, column=1, value=d).number_format = "yyyy-mm-dd"
    ws.cell(row=r, column=2, value=ex)
    ws.cell(row=r, column=3, value=pair)
    ws.cell(row=r, column=4, value=side)
    ws.cell(row=r, column=5, value=strategy)
    ws.cell(row=r, column=6, value=entry).number_format = "#,##0.00"
    ws.cell(row=r, column=7, value=exit_).number_format = "#,##0.00"
    ws.cell(row=r, column=8, value=qty).number_format = "#,##0.0000"
    ws.cell(row=r, column=9, value=fee).number_format = "#,##0.00"
    ws.cell(row=r, column=10, value=f'=IF(D{r}="做多",(G{r}-F{r})*H{r},(F{r}-G{r})*H{r})-I{r}').number_format = "#,##0.00"
    ws.cell(row=r, column=11, value=f'=IFERROR(J{r}/(F{r}*H{r}),0)').number_format = "0.00%"
    ws.cell(row=r, column=12, value=6)
    ws.cell(row=r, column=13, value=entry * 0.97).number_format = "#,##0.00"
    ws.cell(row=r, column=14, value=entry * 1.06).number_format = "#,##0.00"
    ws.cell(row=r, column=15, value="冷静")
    ws.cell(row=r, column=16, value="示例数据，可删除")

for r in range(5, 102):
    ws.cell(row=r, column=10, value=f'=IF(OR(F{r}="",G{r}="",H{r}=""),"",IF(D{r}="做多",(G{r}-F{r})*H{r},(F{r}-G{r})*H{r})-I{r})').number_format = "#,##0.00"
    ws.cell(row=r, column=11, value=f'=IFERROR(J{r}/(F{r}*H{r}),"")').number_format = "0.00%"
    ws.cell(row=r, column=1).number_format = "yyyy-mm-dd"
    ws.cell(row=r, column=6).number_format = "#,##0.00"
    ws.cell(row=r, column=7).number_format = "#,##0.00"
    ws.cell(row=r, column=8).number_format = "#,##0.0000"
    ws.cell(row=r, column=9).number_format = "#,##0.00"
    ws.cell(row=r, column=13).number_format = "#,##0.00"
    ws.cell(row=r, column=14).number_format = "#,##0.00"

for row in ws.iter_rows(min_row=2, max_row=101, min_col=1, max_col=16):
    for c in row:
        c.font = body_font
        c.border = border
        c.alignment = center if c.column not in (2, 3, 5, 16) else left

ws.freeze_panes = "A2"
ws.auto_filter.ref = "A1:P101"
set_widths(ws, [12, 12, 12, 8, 10, 12, 12, 12, 10, 14, 10, 14, 12, 12, 8, 26])
dv_side = DataValidation(type="list", formula1='"做多,做空"', allow_blank=True)
ws.add_data_validation(dv_side)
dv_side.add("D2:D101")
dv_emotion = DataValidation(type="list", formula1='"冷静,焦虑,FOMO,报复,犹豫"', allow_blank=True)
ws.add_data_validation(dv_emotion)
dv_emotion.add("O2:O101")

summary = wb.create_sheet("汇总")
summary.sheet_view.showGridLines = False
summary["A1"] = "交易表现汇总"
summary["A1"].font = Font(name="Microsoft YaHei", size=16, bold=True, color=DARK)
summary["A2"] = "自动统计“交易记录”工作表，新增记录后会自动更新。"
summary["A2"].font = small_font
summary_rows = [
    ("总交易笔数", '=COUNTA(\'交易记录\'!A2:A101)'),
    ("盈利笔数", '=COUNTIF(\'交易记录\'!J2:J101,">0")'),
    ("亏损笔数", '=COUNTIF(\'交易记录\'!J2:J101,"<0")'),
    ("胜率", '=IFERROR(B4/B3,0)'),
    ("总盈亏 (USDT)", '=SUM(\'交易记录\'!J2:J101)'),
    ("平均盈利", '=IFERROR(AVERAGEIF(\'交易记录\'!J2:J101,">0"),0)'),
    ("平均亏损", '=IFERROR(AVERAGEIF(\'交易记录\'!J2:J101,"<0"),0)'),
    ("盈亏比", '=IFERROR(ABS(B8/B9),0)'),
]
for i, (label, formula) in enumerate(summary_rows, 3):
    summary.cell(row=i, column=1, value=label).font = body_font
    summary.cell(row=i, column=2, value=formula).font = body_font
    summary.cell(row=i, column=1).fill = section_fill
    summary.cell(row=i, column=1).border = border
    summary.cell(row=i, column=2).border = border
    summary.cell(row=i, column=2).alignment = center
summary["B5"].number_format = "0.00%"
summary["B7"].number_format = "#,##0.00"
summary["B8"].number_format = "#,##0.00"
summary["B9"].number_format = "#,##0.00"
summary["B10"].number_format = "0.00"
summary.column_dimensions["A"].width = 24
summary.column_dimensions["B"].width = 18

instruction_sheet(wb, "交易记录模板 · 使用说明", [
    "1. 在“交易记录”表填写日期、交易所、交易对、方向、入场/出场价、数量、手续费。",
    "2. “已实现盈亏”和“收益率”会自动计算；做多用（出场-入场）×数量，做空相反。",
    "3. 手续费请填绝对值（例如 3.2 USDT），不要填百分比。",
    "4. “汇总”表自动统计总笔数、胜率、总盈亏、平均盈亏和盈亏比。",
    "5. 建议每笔交易都记录“情绪”和“备注”，复盘时比只看盈亏更有价值。",
    "6. 只记录真实成交；不要把未成交计划单算进去。",
])
wb.save(f"{OUT}/trading-log-template.xlsx")


# ── 2. Position sizing ────────────────────────────────────────
wb = Workbook()
ws = wb.active
ws.title = "仓位计算"
ws.sheet_view.showGridLines = False
ws["A1"] = "仓位管理计算器"
ws["A1"].font = Font(name="Microsoft YaHei", size=16, bold=True, color=DARK)
ws["A2"] = "先定止损，再算仓位。输入黄色单元格，其余自动计算。"
ws["A2"].font = small_font

inputs = [
    ("账户总资金 (USDT)", 10000, "#,##0.00"),
    ("单笔风险比例", 0.01, "0.00%"),
    ("入场价", 60000, "#,##0.00"),
    ("止损价", 57000, "#,##0.00"),
    ("杠杆倍数", 3, "0.0x"),
]
for i, (label, value, fmt) in enumerate(inputs, 4):
    ws.cell(row=i, column=1, value=label).font = body_font
    ws.cell(row=i, column=1).fill = section_fill
    ws.cell(row=i, column=1).border = border
    c = ws.cell(row=i, column=2, value=value)
    c.font = Font(name="Microsoft YaHei", size=11, bold=True, color="92400E")
    c.fill = PatternFill("solid", fgColor="FEF3C7")
    c.number_format = fmt
    c.border = border
    c.alignment = center

calcs = [
    ("风险金额 (USDT)", "=B4*B5", "#,##0.00"),
    ("每单位风险", "=ABS(B6-B7)", "#,##0.00"),
    ("按风险计算的仓位数量", "=IFERROR(B9/B10,0)", "#,##0.0000"),
    ("仓位名义价值 (USDT)", "=B11*B6", "#,##0.00"),
    ("所需保证金 (USDT)", "=IFERROR(B12/B8,0)", "#,##0.00"),
    ("保证金占账户比例", "=IFERROR(B13/B4,0)", "0.00%"),
]
for i, (label, formula, fmt) in enumerate(calcs, 9):
    ws.cell(row=i, column=1, value=label).font = body_font
    ws.cell(row=i, column=1).fill = section_fill
    ws.cell(row=i, column=1).border = border
    c = ws.cell(row=i, column=2, value=formula)
    c.font = body_font
    c.number_format = fmt
    c.border = border
    c.alignment = center

ws["A16"] = "风险检查"
ws["A16"].font = Font(name="Microsoft YaHei", size=12, bold=True, color=DARK)
ws["A17"] = "保证金是否超过账户资金？"
ws["A17"].font = body_font
ws["B17"] = '=IF(B13>B4,"⚠ 仓位过大","✅ 在账户范围内")'
ws["B17"].font = Font(name="Microsoft YaHei", size=11, bold=True, color="B45309")
ws["A18"] = "止损时预计亏损"
ws["A18"].font = body_font
ws["B18"] = "=B9"
ws["B18"].number_format = "#,##0.00"
ws["A19"] = "说明"
ws["A19"].font = body_font
ws["B19"] = "仓位数量 = 风险金额 ÷ 每单位风险；所需保证金 = 名义价值 ÷ 杠杆。"
ws["B19"].font = small_font
ws["B19"].alignment = left

set_widths(ws, [30, 26])
for r in range(4, 19):
    ws.row_dimensions[r].height = 26

instruction_sheet(wb, "仓位管理模板 · 使用说明", [
    "1. 先填账户总资金、单笔风险比例（新手建议 0.5%–1%）。",
    "2. 填入场价和止损价；止损必须基于图表结构，而不是“能亏多少”。",
    "3. 填杠杆倍数；现货可填 1。",
    "4. 黄色单元格是输入项，其余单元格自动计算仓位数量和保证金。",
    "5. 如果“风险检查”显示仓位过大，降低数量或提高止损距离，不要加大杠杆硬扛。",
    "6. 本表按线性合约估算，未计入资金费率、滑点和强平规则；实际下单前请用交易所计算器复核。",
])
wb.save(f"{OUT}/position-sizing-template.xlsx")


# ── 3. DCA plan ───────────────────────────────────────────────
wb = Workbook()
ws = wb.active
ws.title = "定投计划"
headers = ["日期", "币种", "计划金额(USDT)", "买入价(USDT)", "买入数量", "累计投入", "累计数量", "平均成本", "当前价格", "当前价值", "浮动盈亏", "备注"]
for i, h in enumerate(headers, 1):
    ws.cell(row=1, column=i, value=h)
style_header(ws, 1, len(headers))

for idx in range(24):
    r = idx + 2
    d = date(2026 + idx // 12, idx % 12 + 1, 1)
    example_price = 60000 + ((idx % 6) - 3) * 1500
    ws.cell(row=r, column=1, value=d).number_format = "yyyy-mm-dd"
    ws.cell(row=r, column=2, value="BTC")
    ws.cell(row=r, column=3, value=500).number_format = "#,##0.00"
    ws.cell(row=r, column=4, value=example_price).number_format = "#,##0.00"
    ws.cell(row=r, column=5, value=f'=IFERROR(C{r}/D{r},"")').number_format = "#,##0.000000"
    ws.cell(row=r, column=6, value=f'=SUM($C$2:C{r})').number_format = "#,##0.00"
    ws.cell(row=r, column=7, value=f'=SUM($E$2:E{r})').number_format = "#,##0.000000"
    ws.cell(row=r, column=8, value=f'=IFERROR(F{r}/G{r},"")').number_format = "#,##0.00"
    ws.cell(row=r, column=9, value=65000).number_format = "#,##0.00"
    ws.cell(row=r, column=10, value=f'=IFERROR(G{r}*I{r},"")').number_format = "#,##0.00"
    ws.cell(row=r, column=11, value=f'=IFERROR(J{r}-F{r},"")').number_format = "#,##0.00"
    ws.cell(row=r, column=12, value="示例价格，仅演示公式")

for row in ws.iter_rows(min_row=2, max_row=25, min_col=1, max_col=12):
    for c in row:
        c.font = body_font
        c.border = border
        c.alignment = center if c.column not in (2, 12) else left

ws.freeze_panes = "A2"
ws.auto_filter.ref = "A1:L25"
set_widths(ws, [12, 8, 15, 14, 14, 14, 14, 12, 12, 14, 14, 26])

summary = wb.create_sheet("汇总")
summary.sheet_view.showGridLines = False
summary["A1"] = "定投汇总"
summary["A1"].font = Font(name="Microsoft YaHei", size=16, bold=True, color=DARK)
summary["A2"] = "修改“定投计划”里的买入价/当前价格后自动更新。"
summary["A2"].font = small_font
rows = [
    ("累计投入 (USDT)", "=SUM('定投计划'!C2:C25)"),
    ("累计买入数量", "=SUM('定投计划'!E2:E25)"),
    ("平均成本", "=IFERROR(B3/B4,0)"),
    ("当前总价值", "='定投计划'!J25"),
    ("浮动盈亏", "='定投计划'!K25"),
    ("当前收益率", "=IFERROR(B7/B3,0)"),
]
for i, (label, formula) in enumerate(rows, 3):
    summary.cell(row=i, column=1, value=label).font = body_font
    summary.cell(row=i, column=1).fill = section_fill
    summary.cell(row=i, column=1).border = border
    c = summary.cell(row=i, column=2, value=formula)
    c.font = body_font
    c.border = border
    c.alignment = center
summary["B3"].number_format = "#,##0.00"
summary["B4"].number_format = "#,##0.000000"
summary["B5"].number_format = "#,##0.00"
summary["B6"].number_format = "#,##0.00"
summary["B7"].number_format = "#,##0.00"
summary["B8"].number_format = "0.00%"
summary.column_dimensions["A"].width = 24
summary.column_dimensions["B"].width = 18

instruction_sheet(wb, "DCA 定投计划模板 · 使用说明", [
    "1. 在“定投计划”表填写每次定投日期、金额和实际买入价；买入数量自动计算。",
    "2. 当前价格只需填最后一行，前面行可留空；当前价值和浮动盈亏会自动计算。",
    "3. 累计投入、累计数量、平均成本会自动滚动汇总。",
    "4. 建议固定周期（每周/每月）和固定金额，避免情绪化加仓。",
    "5. 只使用闲钱；不要借贷或使用生活必需资金定投。",
    "6. 本表不构成投资建议，历史定投表现不代表未来收益。",
])
wb.save(f"{OUT}/dca-plan-template.xlsx")

print("created")
