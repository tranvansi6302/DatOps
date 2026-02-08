// =====================
// CONFIG (GIỮ NGUYÊN)
// =====================
const CONFIG = {
    LEADER_FILE_ID: "1fj4ovxOIEQ5ZVhMK2GWwTLnUMsRSCarf1qZ52UphNHA",
    LEADER_START_ROW: 2,
    LEADER_COL_STT: 1,
    LEADER_COL_CODE: 2,
    LEADER_COL_SYSTEM: 3,
    LEADER_COL_ACTOR: 4,
    LEADER_EPIC_COL: 5,
    LEADER_MAIN_TASK_COL: 6,
    SPRINT_SHEET_NAME: "SPRINT",
    SPRINT_START_ROW: 2,
    DEV_START_ROW: 5
};

// =====================
// doGet (GIỮ NGUYÊN)
// =====================
function doGet(e) {
    var output = ContentService.createTextOutput();
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheetName = ss.getName();
        var sheets = ss.getSheets().map(function (s) {
            return { id: s.getSheetId(), name: s.getName() };
        });

        // Nếu có leaderFileId trong query params, lấy tên Leader Sheet và danh sách Tabs
        var leaderSheetName = "";
        var leaderSheets = [];
        if (e.parameter && e.parameter.leaderFileId) {
            try {
                var leaderSS = SpreadsheetApp.openById(e.parameter.leaderFileId);
                leaderSheetName = leaderSS.getName();
                leaderSheets = leaderSS.getSheets().map(function (s) {
                    return { id: s.getSheetId(), name: s.getName() };
                });
            } catch (err) {
                leaderSheetName = "Error: " + err.toString();
            }
        }

        // Check for docId to get Google Doc name and Version
        var docName = "";
        var docTabs = [];
        var currentDocVersion = "1.0";
        if (e.parameter && e.parameter.docId) {
            try {
                // Use DocumentApp to verify permissions for writing later
                var doc = DocumentApp.openById(e.parameter.docId);
                docName = doc.getName();
                currentDocVersion = getDocLatestVersion(doc); // Get latest version

                // Try to get Tabs (new feature)
                try {
                    if (doc.getTabs) {
                        docTabs = doc.getTabs().map(function (t) {
                            return { id: t.getId(), title: t.getTitle() };
                        });
                    }
                } catch (tabErr) {
                    // Ignore if tabs not supported or error
                }
            } catch (err) {
                docName = "Error: " + err.toString();
            }
        }

        return output
            .setContent(
                JSON.stringify({
                    status: "success",
                    sheetName: sheetName,
                    leaderSheetName: leaderSheetName,
                    docName: docName,
                    currentDocVersion: currentDocVersion,
                    docTabs: docTabs, // Return tabs list
                    data: sheets, // Detail/Dev Sheets
                    leaderSheets: leaderSheets // Leader Sheets
                })
            )
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return output
            .setContent(JSON.stringify({ status: "error", message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}


// =====================
// CHIP_CONFIG (GIỮ NGUYÊN)
// =====================
const CHIP_CONFIG = {
    PRIORITY: {
        options: ["HIGH", "MEDIUM", "LOW", "N/A"],
        colors: {
            HIGH: ["#F9D5D5", "#B10202"],
            MEDIUM: ["#FFF0C7", "#966900"],
            LOW: ["#CEEAD6", "#0D652D"],
            "N/A": ["#E8EAED", "#3C4043"]
        }
    },
    COMPLEX: {
        options: ["COMPLEX", "MEDIUM", "SIMPLE", "N/A"],
        colors: {
            COMPLEX: ["#F9D5D5", "#B10202"],
            MEDIUM: ["#FFF0C7", "#966900"],
            SIMPLE: ["#CEEAD6", "#0D652D"],
            "N/A": ["#E8EAED", "#3C4043"]
        }
    },
    L_STATUS: {
        options: ["Done", "In progress", "Not started yet", "Delay"],
        colors: {
            Done: ["#D2E3FC", "#174EA6"],
            "In progress": ["#C2E7FF", "#004A77"],
            "Not started yet": ["#E8EAED", "#3C4043"],
            Delay: ["#F9D5D5", "#B10202"]
        }
    },
    PM_STATUS: {
        options: ["PASSED", "FAILED", "SKIPPED", "N/A"],
        colors: {
            PASSED: ["#D2E3FC", "#174EA6"],
            FAILED: ["#F9D5D5", "#B10202"],
            SKIPPED: ["#FFE5D3", "#B10202"],
            "N/A": ["#E8EAED", "#3C4043"]
        }
    }
};

// =====================
// Helpers (GIỮ NGUYÊN)
// =====================
function formatTimeValue(value) {
    if (value === undefined || value === null || value === "") return "";

    let num = parseFloat(value);
    if (isNaN(num)) return value;

    let roundedNum = Number(num.toFixed(2));
    return roundedNum.toString().replace(".", ",") + "h";
}

function applyChipStyle(range, chipType) {
    const config = CHIP_CONFIG[chipType];
    if (!config) return;
    const rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(config.options)
        .setAllowInvalid(true)
        .build();
    range.setDataValidation(rule);
    const sheet = range.getSheet();
    const rules = sheet.getConditionalFormatRules();
    for (let val in config.colors) {
        rules.push(
            SpreadsheetApp.newConditionalFormatRule()
                .whenTextEqualTo(val)
                .setBackground(config.colors[val][0])
                .setFontColor(config.colors[val][1])
                .setRanges([range])
                .build()
        );
    }
    sheet.setConditionalFormatRules(rules);
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === "" || dateStr === "N/A") return "";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const day = ("0" + d.getDate()).slice(-2);
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateStr;
    }
}

// Helper to get the latest version from Document
function getDocLatestVersion(doc) {
    try {
        const body = doc.getBody();
        const tables = body.getTables();
        let revisionTable = null;

        // Find Revision Table
        for (let t = 0; t < tables.length; t++) {
            const table = tables[t];
            if (table.getNumRows() > 0) {
                const row0 = table.getRow(0);
                if (row0.getNumCells() >= 3) {
                    const h1 = row0.getCell(0).getText().trim();
                    const h2 = row0.getCell(1).getText().trim();
                    if (h1.match(/version/i) && h2.match(/date/i)) {
                        revisionTable = table;
                        break;
                    }
                }
            }
        }

        if (revisionTable && revisionTable.getNumRows() > 1) {
            // Get latest version from the last row that has content
            for (let i = revisionTable.getNumRows() - 1; i >= 1; i--) {
                const v = revisionTable.getRow(i).getCell(0).getText().trim();
                if (v) return v;
            }
        }
    } catch (e) {
        return "1.0";
    }
    return "1.0";
}


// ======================================================
// updateRevisionHistory (CHỈ SỬA Ở ĐÂY THEO YÊU CẦU)
// - Giữ nguyên logic của bạn
// - Cuối hàm: LUÔN TRẢ VỀ VERSION CUỐI CÙNG TRONG TABLE
// ======================================================
// updateRevisionHistory
function updateRevisionHistory(body, epics, userVersion, userDescription) {
    const currentDate = Utilities.formatDate(new Date(), "GMT+7", "yyyy/MM/dd");
    const displayDate = Utilities.formatDate(new Date(), "GMT+7", "MMMM, dd yyyy");
    const searchDate = `<${currentDate}>`;

    // Description logic
    const newDescriptions = userDescription ? userDescription : epics.map(epic => epic.epicName || "N/A").join(", ");

    const tables = body.getTables();
    let revisionTable = null;
    let finalVersion = "1.0";

    // TÌM BẢNG HISTORY CHÍNH XÁC (Dựa vào Header)
    for (let t = 0; t < tables.length; t++) {
        const table = tables[t];
        if (table.getNumRows() > 0) {
            const row0 = table.getRow(0);
            if (row0.getNumCells() >= 3) {
                const h1 = row0.getCell(0).getText().trim();
                const h2 = row0.getCell(1).getText().trim();
                const h3 = row0.getCell(2).getText().trim();
                if (h1.match(/version/i) && h2.match(/date/i) && h3.match(/description/i)) {
                    revisionTable = table;
                    break;
                }
            }
        }
    }

    // Nếu chưa có bảng (hoặc document mới tinh), tạo Header và Bảng
    if (!revisionTable) {
        // ... (creation logic same as before, omitted for brevity if not changed, but must include full block here)
        if (body.getText().trim() === "") {
            body.clear();
            body.appendPageBreak();
            body.appendPageBreak();
            body.appendPageBreak();
        }

        const revTitle = body.appendParagraph("REVISION HISTORY");
        revTitle.setHeading(DocumentApp.ParagraphHeading.HEADING1)
            .setFontSize(16)
            .setBold(true)
            .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
            .setLineSpacing(1.5)
            .setForegroundColor("#000000");

        body.appendParagraph("[Use the table below to record information regarding changes made to the document over time]")
            .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
            .setItalic(true)
            .setLineSpacing(1.5)
            .setForegroundColor("#FF0000")
            .setFontSize(10);

        body.appendParagraph("");
        body.appendParagraph("");

        revisionTable = body.appendTable([["Version", "Date", "Description"]]);

        const headerRow = revisionTable.getRow(0);
        headerRow.setBackgroundColor(null).setBold(true).setItalic(false);

        const h1 = headerRow.getCell(0).getChild(0).asParagraph();
        h1.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor("#000000");

        const h2 = headerRow.getCell(1).getChild(0).asParagraph();
        h2.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor("#000000");

        const h3 = headerRow.getCell(2).getChild(0).asParagraph();
        h3.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor("#000000");

        revisionTable.setColumnWidth(0, 60);
        revisionTable.setColumnWidth(1, 100);
        revisionTable.setBorderWidth(1).setBorderColor("#000000");
    }

    // Logic insert data
    const numRows = revisionTable.getNumRows();
    let dateExists = false;

    // Try to find today's row to update
    for (let i = 1; i < numRows; i++) {
        const row = revisionTable.getRow(i);
        if (row.getNumCells() < 3) continue;

        const dateCell = row.getCell(1);
        const dateText = dateCell.getText().trim();

        if (dateText === searchDate) {
            const descCell = row.getCell(2);
            // If user supplied explicit description, we might want to append or just use it. 
            // Logic: Append if it's different? 
            // Provided logic: "nếu có nhập thì lấy bình thường". 
            // To ensure we capture the specific commit, we just append it as new paragraph.
            const p = descCell.appendParagraph(newDescriptions);

            p.setAttributes({
                [DocumentApp.Attribute.FONT_SIZE]: 11,
                [DocumentApp.Attribute.BOLD]: false,
                [DocumentApp.Attribute.ITALIC]: false,
                [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000",
                [DocumentApp.Attribute.LINE_SPACING]: 1.5
            });
            p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);

            // Update Version if User Specified and different
            if (userVersion) {
                row.getCell(0).setText(userVersion); // Force update version
                finalVersion = userVersion;
            } else {
                finalVersion = row.getCell(0).getText().trim();
            }

            dateExists = true;
            break;
        }
    }

    if (!dateExists) {
        let nextVersion = "1.0";
        if (userVersion) {
            nextVersion = userVersion;
        } else {
            // Auto increment
            if (numRows > 1) {
                const lastRow = revisionTable.getRow(numRows - 1);
                if (lastRow.getNumCells() > 0) {
                    const lastVer = lastRow.getCell(0).getText().trim();
                    const verNum = parseFloat(lastVer);
                    if (!isNaN(verNum)) {
                        nextVersion = (verNum + 0.1).toFixed(1);
                    }
                }
            }
        }
        finalVersion = nextVersion;

        const newRow = revisionTable.appendTableRow();

        const cellVer = newRow.appendTableCell(nextVersion);
        if (cellVer.getNumChildren() > 0) cellVer.clear();

        const pVer = cellVer.appendParagraph(nextVersion);
        pVer.setAttributes({
            [DocumentApp.Attribute.FONT_SIZE]: 11,
            [DocumentApp.Attribute.BOLD]: true,
            [DocumentApp.Attribute.ITALIC]: false,
            [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000",
            [DocumentApp.Attribute.LINE_SPACING]: 1.5,
            [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
        });
        cellVer.setBackgroundColor(null);

        const cellDate = newRow.appendTableCell(searchDate);
        if (cellDate.getNumChildren() > 0) cellDate.clear();

        const pDate = cellDate.appendParagraph(searchDate);
        pDate.setAttributes({
            [DocumentApp.Attribute.FONT_SIZE]: 11,
            [DocumentApp.Attribute.BOLD]: false,
            [DocumentApp.Attribute.ITALIC]: false,
            [DocumentApp.Attribute.FOREGROUND_COLOR]: "#FF0000",
            [DocumentApp.Attribute.LINE_SPACING]: 1.5,
            [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
        });
        cellDate.setBackgroundColor(null);

        const cellDesc = newRow.appendTableCell(newDescriptions);
        if (cellDesc.getNumChildren() > 0) cellDesc.clear();

        const pDesc = cellDesc.appendParagraph(newDescriptions);
        pDesc.setAttributes({
            [DocumentApp.Attribute.FONT_SIZE]: 11,
            [DocumentApp.Attribute.BOLD]: false,
            [DocumentApp.Attribute.ITALIC]: false,
            [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000",
            [DocumentApp.Attribute.LINE_SPACING]: 1.5,
            [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.LEFT
        });
        cellDesc.setBackgroundColor(null);
    }

    return { version: finalVersion, date: displayDate };
}


// ======================================================
// updateDocHeader (CHỈ SỬA Ở ĐÂY THEO YÊU CẦU)
// - Giữ nguyên các phần khác
// - Update chuẩn cả paragraph trong body + table + header nếu có
// - Format: label đen đậm, value đỏ
// ======================================================
function updateDocHeader(doc, body, version, dateStr) {
    const verText = `Version: <${version}>`;
    const dateText = `Last Modified: <${dateStr}>`;

    const targets = [];
    try {
        const fpHeader = doc.getFirstPageHeader();
        if (fpHeader) targets.push(fpHeader);
    } catch (e) { }

    const header = doc.getHeader();
    if (header) targets.push(header);

    const mainBody = doc.getBody();
    if (mainBody) targets.push(mainBody);
    if (body && body !== mainBody) targets.push(body);

    const reVer = /version\s*:/i;
    const reDate = /last\s*modified\s*:/i;

    function formatLine_(p, labelLen) {
        p.setAlignment(DocumentApp.HorizontalAlignment.CENTER)
            .setLineSpacing(1.5)
            .setFontSize(14)
            .setItalic(false);

        const t = p.editAsText();
        const txt = p.getText();
        const L = txt.length;
        const labelEnd = Math.min(labelLen - 1, L - 1);

        if (labelEnd >= 0) {
            t.setBold(0, labelEnd, true);
            t.setForegroundColor(0, labelEnd, "#000000");
        }
        if (labelEnd + 1 <= L - 1) {
            t.setBold(labelEnd + 1, L - 1, false);
            t.setForegroundColor(labelEnd + 1, L - 1, "#FF0000");
        }
    }

    // Duyệt paragraph trong container, kể cả nằm trong TABLE
    function forEachParagraph_(container, fn) {
        const n = container.getNumChildren ? container.getNumChildren() : 0;
        for (let i = 0; i < n; i++) {
            const child = container.getChild(i);
            const type = child.getType();

            if (type === DocumentApp.ElementType.PARAGRAPH) {
                fn(child.asParagraph());
            } else if (type === DocumentApp.ElementType.TABLE) {
                const table = child.asTable();
                for (let r = 0; r < table.getNumRows(); r++) {
                    const row = table.getRow(r);
                    for (let c = 0; c < row.getNumCells(); c++) {
                        const cell = row.getCell(c);
                        for (let k = 0; k < cell.getNumChildren(); k++) {
                            const el = cell.getChild(k);
                            if (el.getType() === DocumentApp.ElementType.PARAGRAPH) {
                                fn(el.asParagraph());
                            }
                        }
                    }
                }
            }
        }
    }

    let verCount = 0;
    let dateCount = 0;

    for (const c of targets) {
        forEachParagraph_(c, (p) => {
            const txt = p.getText();

            // Replace HẾT mọi dòng có Version:
            if (txt && reVer.test(txt)) {
                p.setText(verText);
                formatLine_(p, "Version:".length);
                verCount++;
            }

            // Replace HẾT mọi dòng có Last Modified:
            if (txt && reDate.test(txt)) {
                p.setText(dateText);
                formatLine_(p, "Last Modified:".length);
                dateCount++;
            }
        });
    }

    Logger.log("Updated Version lines: " + verCount);
    Logger.log("Updated Last Modified lines: " + dateCount);

    // Fallback nếu không thấy
    if (verCount === 0 && body) {
        const pVer = body.insertParagraph(0, verText);
        formatLine_(pVer, "Version:".length);
    }
    if (dateCount === 0 && body) {
        const pDate = body.insertParagraph(1, dateText);
        formatLine_(pDate, "Last Modified:".length);
        try { pDate.setSpacingAfter(20); } catch (e) { }
    }
}

// =====================
// writeToGoogleDoc (GIỮ NGUYÊN, CHỈ GỌI 2 HÀM Ở TRÊN)
// =====================
function writeToGoogleDoc(docId, epics, tabId, userVersion, userDesc) {
    if (!docId || !epics || epics.length === 0) return;

    const doc = DocumentApp.openById(docId);
    let body;

    // Try to get specific tab body if tabId is provided
    if (tabId) {
        try {
            if (doc.getTab) {
                const tab = doc.getTab(tabId);
                if (tab) {
                    if (tab.asDocumentTab) {
                        body = tab.asDocumentTab().getBody();
                    } else if (tab.getBody) {
                        body = tab.getBody();
                    }
                }
            }
        } catch (e) {
            // Fallback to main body if tab lookup fails
        }
    }

    // Default to active document body if no tab specific body found
    if (!body) body = doc.getBody();

    // 1. Cập nhật hoặc tạo mới bảng lịch sử ở đầu trang
    const revInfo = updateRevisionHistory(body, epics, userVersion, userDesc);

    // 2. Cập nhật Version/Last Modified theo version cuối trong table history
    updateDocHeader(doc, body, revInfo.version, revInfo.date);

    const styleH1 = {
        [DocumentApp.Attribute.HEADING]: DocumentApp.ParagraphHeading.HEADING1,
        [DocumentApp.Attribute.FONT_SIZE]: 16,
        [DocumentApp.Attribute.BOLD]: true,
        [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER,
        [DocumentApp.Attribute.LINE_SPACING]: 1.5,
        [DocumentApp.Attribute.SPACING_AFTER]: 25,
        [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000"
    };

    const styleH2 = {
        [DocumentApp.Attribute.HEADING]: DocumentApp.ParagraphHeading.HEADING2,
        [DocumentApp.Attribute.FONT_SIZE]: 14,
        [DocumentApp.Attribute.BOLD]: true,
        [DocumentApp.Attribute.LINE_SPACING]: 1.5,
        [DocumentApp.Attribute.SPACING_BEFORE]: 20,
        [DocumentApp.Attribute.SPACING_AFTER]: 8,
        [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000"
    };

    const styleH4 = {
        [DocumentApp.Attribute.HEADING]: DocumentApp.ParagraphHeading.HEADING4,
        [DocumentApp.Attribute.FONT_SIZE]: 12,
        [DocumentApp.Attribute.BOLD]: true,
        [DocumentApp.Attribute.LINE_SPACING]: 1.5,
        [DocumentApp.Attribute.INDENT_START]: 18,
        [DocumentApp.Attribute.SPACING_BEFORE]: 12,
        [DocumentApp.Attribute.SPACING_AFTER]: 6,
        [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000"
    };

    const styleLI = {
        [DocumentApp.Attribute.FONT_SIZE]: 12,
        [DocumentApp.Attribute.BOLD]: false,
        [DocumentApp.Attribute.LINE_SPACING]: 1.5,
        [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000"
    };

    epics.forEach((epic, index) => {
        if (index > 0 || body.getText().trim() !== "") {
            body.appendPageBreak();
        }

        const titleText = `#${index + 1}. ${epic.epicCode || ""} ${epic.epicName || ""}`;
        const title = body.appendParagraph(titleText);
        // Force style to override Google Doc defaults for Heading 1
        title.setHeading(DocumentApp.ParagraphHeading.HEADING1)
            .setFontSize(16)
            .setBold(true)
            .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
            .setLineSpacing(1.5)
            .setSpacingAfter(25)
            .setForegroundColor("#000000");

        // --- 1. Overview ---
        body.appendParagraph("1. Overview").setAttributes(styleH2).setSpacingBefore(15);
        body.appendParagraph(epic.overview || "No overview provided.").setAttributes(styleLI);

        // --- 2. Requirements ---
        body.appendParagraph("2. Requirements").setAttributes(styleH2);

        let reqs = epic.requirements;
        if (!reqs || !Array.isArray(reqs) || reqs.length === 0) {
            reqs = ["Yêu cầu 1", "Yêu cầu 2", "Yêu cầu 3"];
        }

        reqs.forEach(req => {
            body.appendListItem(req).setAttributes(styleLI).setGlyphType(DocumentApp.GlyphType.BULLET).setIndentStart(36);
        });

        // --- 3. Implementation ---
        body.appendParagraph("3. Implementation").setAttributes(styleH2);

        const implTasks = epic.tasks.filter(t => t.isTestCase !== true);
        implTasks.forEach((task, tIdx) => {
            body.appendParagraph(`3.${tIdx + 1}. ${task.mainTask}`).setAttributes(styleH4);

            if (task.subTasks && task.subTasks.length > 0) {
                task.subTasks.forEach(sub => {
                    const subName = typeof sub === "string" ? sub : (sub.name || "");
                    body.appendListItem(subName).setAttributes(styleLI).setGlyphType(DocumentApp.GlyphType.BULLET).setIndentStart(36);
                });
            }
        });

        // --- 4. Testcase ---
        const testCases = epic.tasks.filter(t => t.isTestCase === true);
        if (testCases.length > 0) {
            body.appendParagraph("4. Testcase").setAttributes(styleH2);

            testCases.forEach((tc, tcIdx) => {
                body.appendParagraph(`4.${tcIdx + 1}. ${tc.mainTask}`).setAttributes(styleH4);

                if (tc.subTasks && tc.subTasks.length > 0) {
                    tc.subTasks.forEach(sub => {
                        const subName = typeof sub === "string" ? sub : (sub.name || "");
                        body.appendListItem(subName).setAttributes(styleLI).setGlyphType(DocumentApp.GlyphType.BULLET).setIndentStart(36);
                    });
                }
            });
        }

        // --- 5. Results ---
        body.appendParagraph("5. Results").setAttributes(styleH2);

        let results = epic.results;
        if (!results || !Array.isArray(results) || results.length === 0) {
            results = ["Result 1", "Result 2", "Result 3"];
        }

        results.forEach(res => {
            body.appendListItem(res).setAttributes(styleLI).setGlyphType(DocumentApp.GlyphType.BULLET).setIndentStart(36);
        });
    });

    doc.saveAndClose();
}

// =====================
// doPost (GIỮ NGUYÊN)
// =====================
function doPost(e) {
    try {
        const ssDev = SpreadsheetApp.getActiveSpreadsheet();
        const payloadData = JSON.parse(e.parameter.tasksData || "[]");
        const epics = Array.isArray(payloadData) ? payloadData : [payloadData];

        const leaderFileId = e.parameter.leaderFileId || CONFIG.LEADER_FILE_ID;
        const leaderSS = SpreadsheetApp.openById(leaderFileId);

        // --- 1. HANDLE LEADER SHEET SELECTION ---
        let leaderSheet = leaderSS.getSheets()[0]; // Default
        const userLeaderSheetName = e.parameter.leaderSheetName;
        if (userLeaderSheetName) {
            const foundLeaderSheet = leaderSS.getSheetByName(userLeaderSheetName);
            if (foundLeaderSheet) {
                leaderSheet = foundLeaderSheet;
            }
        }

        let currentEpicStt = 0;
        let lastRowLeader = leaderSheet.getLastRow();
        if (lastRowLeader >= CONFIG.LEADER_START_ROW) {
            const epicVals = leaderSheet
                .getRange(CONFIG.LEADER_START_ROW, CONFIG.LEADER_EPIC_COL, lastRowLeader - CONFIG.LEADER_START_ROW + 1, 1)
                .getValues();
            epicVals.forEach(r => {
                const m = r[0].toString().match(/^(\d+)\./);
                if (m) currentEpicStt = Math.max(currentEpicStt, parseInt(m[1]));
            });
        }

        updateSprintSheet(ssDev, epics, currentEpicStt);

        // --- 2. HANDLE DETAIL SHEET SELECTION ---
        const userDetailSheetName = e.parameter.detailSheetName;
        let forcedDetailSheet = null;
        if (userDetailSheetName) {
            forcedDetailSheet = ssDev.getSheetByName(userDetailSheetName);
        }

        let processedDetailSheets = {};

        epics.forEach((epicObj, eIdx) => {
            const epicNum = currentEpicStt + eIdx + 1;
            let epicTitle = `${epicNum}. ${epicObj.epicName || "N/A"}`;
            const tasksData = epicObj.tasks || [];
            if (tasksData.length === 0) return;

            // --- 2.1 HANDLE LEADER SHEET (OPTIMIZED) ---
            const leaderTasksData = tasksData.filter(t => t.isTestCase !== true);
            if (leaderTasksData.length > 0) {
                let lastRowL = leaderSheet.getLastRow();
                let insertAtL = Math.max(lastRowL + 1, CONFIG.LEADER_START_ROW);
                let rowCount = leaderTasksData.length;

                // Prepare grids for Leader Sheet
                let leaderData = [];
                let leaderHAligns = [];
                let leaderVAligns = [];

                for (let i = 0; i < rowCount; i++) {
                    leaderData.push([epicNum, epicObj.epicCode || "", epicObj.epicSystem || "", epicObj.epicActor || "", epicTitle]);
                    leaderHAligns.push(["center", "left", "left", "left", "left"]);
                    leaderVAligns.push(Array(5).fill("middle"));
                }

                const headerRange = leaderSheet.getRange(insertAtL, 1, rowCount, 5);
                headerRange.setValues(leaderData);
                headerRange.setHorizontalAlignments(leaderHAligns);
                headerRange.setVerticalAlignments(leaderVAligns);

                if (rowCount > 1) {
                    for (let i = 1; i <= 5; i++) {
                        leaderSheet.getRange(insertAtL, i, rowCount, 1).merge();
                    }
                }

                const leaderRows = leaderTasksData.map((t, idx) => {
                    const subCount = (t.subTasks || []).length;
                    return [
                        `${epicNum}.${idx + 1}. ${t.mainTask}`,
                        "",
                        t.pointsDev,
                        subCount,
                        t.priority,
                        formatDate(t.startDate),
                        formatDate(t.endDate),
                        formatDate(t.delayDate),
                        formatDate(t.finishedDate),
                        t.statusLeader,
                        t.pointsLeader,
                        t.sourceVersion,
                        t.business,
                        t.statusPm,
                        t.complexity,
                        t.pointsPm
                    ];
                });
                leaderSheet.getRange(insertAtL, 6, rowCount, 16).setValues(leaderRows);

                applyChipStyle(leaderSheet.getRange(insertAtL, 10, rowCount, 1), "PRIORITY");
                applyChipStyle(leaderSheet.getRange(insertAtL, 15, rowCount, 1), "L_STATUS");
                applyChipStyle(leaderSheet.getRange(insertAtL, 19, rowCount, 1), "PM_STATUS");
                applyChipStyle(leaderSheet.getRange(insertAtL, 20, rowCount, 1), "COMPLEX");
                leaderSheet.getRange(insertAtL, 1, rowCount, 21).setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);
            }

            // --- 2.2 HANDLE DETAIL SHEET (MAX OPTIMIZED) ---
            const detailSheet = forcedDetailSheet || getOrCreateDetailSheet(ssDev, epicObj.epicCode);
            let lastRowDevInit = detailSheet.getLastRow();
            let startRowDetail = Math.max(lastRowDevInit + 1, CONFIG.DEV_START_ROW);
            let countSTT = 0;
            if (lastRowDevInit >= CONFIG.DEV_START_ROW) {
                const colAValues = detailSheet.getRange(CONFIG.DEV_START_ROW, 1, lastRowDevInit - CONFIG.DEV_START_ROW + 1, 1).getValues();
                countSTT = colAValues.filter(cell => cell[0] !== "" && cell[0] !== null).length;
            }

            let allDetailData = [];
            let allRichText = [];
            let mergeTasks = [];
            let allBgs = [];
            let allWeights = [];
            let allColors = [];
            let allSizes = [];
            let allHAligns = [];
            let allVAligns = [];
            let rowHeights = []; // To store row height changes

            const addRowStyles = (bg, weight, color, size, hAlign, vAlign) => {
                allBgs.push(Array(11).fill(bg || null));
                allWeights.push(Array(11).fill(weight || "normal"));
                allColors.push(Array(11).fill(color || "black"));
                allSizes.push(Array(11).fill(size || 10));
                allHAligns.push(Array(11).fill(hAlign || "center"));
                allVAligns.push(Array(11).fill(vAlign || "top"));
            };

            const sheetNameKey = detailSheet.getName();
            if (lastRowDevInit < 5 && !processedDetailSheets[sheetNameKey]) {
                const sheetTitle = sheetNameKey;
                let currentR = startRowDetail + allDetailData.length;
                allDetailData.push([sheetTitle, "", "", "", "", "", "", "", "", "", ""]);
                addRowStyles("#CFE2F3", "bold", "black", 10, "center", "middle");
                allRichText.push([SpreadsheetApp.newRichTextValue().setText(sheetTitle).build()]);
                mergeTasks.push({ r: currentR, c: 1, rs: 1, cs: 11 });
                processedDetailSheets[sheetNameKey] = true;
            }

            const isTC = (t) => t.isTestCase === true || String(t.isTestCase) === "true";
            const logicTasks = tasksData.filter(t => !isTC(t));
            const testCaseTasks = tasksData.filter(t => isTC(t));

            let globalTaskIdx = 0;
            let tcCounter = 0;

            const processGroup = (groupTasks, groupTitle) => {
                if (groupTasks.length === 0) return;

                const firstTask = groupTasks[0];
                const lastTask = groupTasks[groupTasks.length - 1];
                let groupStartR = startRowDetail + allDetailData.length;
                let groupRowsCount = 1;

                let groupSumEffort = 0;
                groupTasks.forEach(task => {
                    const subs = (Array.isArray(task.subTasks) && task.subTasks.length > 0) ? task.subTasks : [{ name: "" }];
                    groupSumEffort += subs.length * (parseFloat(task.timeValue) || 0);
                });

                const idValue = `ID-${("0" + (countSTT + 1)).slice(-2)}`;
                allDetailData.push([
                    idValue, formatDate(firstTask.startDate), formatDate(firstTask.endDate),
                    groupTitle, "", "", lastTask.statusPm || "N/A", "",
                    lastTask.priority, lastTask.complexity, formatTimeValue(groupSumEffort)
                ]);

                // Styles for Divider Row
                let rowBg = Array(11).fill(null);
                rowBg[3] = rowBg[4] = rowBg[5] = "#e2efda";
                allBgs.push(rowBg);

                let rowWeight = Array(11).fill("normal");
                rowWeight[3] = "bold";
                allWeights.push(rowWeight);

                let rowColor = Array(11).fill("black");
                rowColor[3] = rowColor[6] = rowColor[8] = rowColor[9] = "#FF0000";
                allColors.push(rowColor);

                let rowSize = Array(11).fill(10);
                rowSize[3] = 12;
                allSizes.push(rowSize);

                let rowHAlign = Array(11).fill("center");
                rowHAlign[3] = "center"; // Implementation / Testcase heading CENTER (merged D-F)
                rowHAlign[6] = "left";   // TEST RESULT left
                rowHAlign[8] = "left";   // PRIORITY left
                rowHAlign[9] = "left";   // COMPLEXITY left
                rowHAlign[10] = "right"; // ESTIMATION right
                allHAligns.push(rowHAlign);
                allVAligns.push(Array(11).fill("middle"));
                rowHeights.push({ row: groupStartR, height: 30 });

                allRichText.push([SpreadsheetApp.newRichTextValue()
                    .setText(groupTitle)
                    .setTextStyle(SpreadsheetApp.newTextStyle()
                        .setForegroundColor("#FF0000").setFontSize(12).setBold(true).build())
                    .build()]);

                mergeTasks.push({ r: groupStartR, c: 4, rs: 1, cs: 3 });

                groupTasks.forEach((task) => {
                    globalTaskIdx++;
                    let currentTaskR = startRowDetail + allDetailData.length;
                    const mainTaskNum = `${epicNum}.${globalTaskIdx}`;
                    const subs = (Array.isArray(task.subTasks) && task.subTasks.length > 0) ? task.subTasks : [{ name: "" }];
                    const rowSpan = subs.length;
                    groupRowsCount += rowSpan;
                    let taskIsTC = isTC(task);
                    if (taskIsTC) tcCounter++;

                    mergeTasks.push({ r: currentTaskR, c: 4, rs: rowSpan, cs: 1 });

                    subs.forEach((subItem, sIdx) => {
                        let displayMainTask = task.mainTask;
                        if (taskIsTC) displayMainTask = `[Testcase-${("0" + tcCounter).slice(-2)}] ${task.mainTask}`;
                        const fullText = `${mainTaskNum}. ${displayMainTask}`;
                        const subName = (typeof subItem === "object" ? subItem.name : subItem) || "";
                        const subText = subName ? `${mainTaskNum}.${sIdx + 1}. ${subName}` : "";

                        allDetailData.push([
                            idValue, formatDate(task.startDate), formatDate(task.endDate),
                            fullText, subText, "", subItem.statusPm || task.statusPm || "N/A",
                            "", subItem.priority || task.priority, subItem.complexity || task.complexity,
                            formatTimeValue(subItem.timeValue || task.timeValue)
                        ]);

                        allBgs.push(["#D9D9D9", null, null, null, null, null, null, null, null, null, null]);
                        allWeights.push(["bold", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal"]);
                        allColors.push(Array(11).fill("black"));
                        allSizes.push(Array(11).fill(10));
                        allHAligns.push(["center", "center", "center", "left", "left", "center", "left", "center", "left", "left", "right"]);
                        allVAligns.push(Array(11).fill("middle"));

                        let rt = SpreadsheetApp.newRichTextValue().setText(fullText);
                        if (taskIsTC) {
                            const prefixEnd = fullText.indexOf("]") + 1;
                            if (prefixEnd > 0) rt.setTextStyle(0, prefixEnd, SpreadsheetApp.newTextStyle().setForegroundColor("#FF0000").setBold(true).build());
                        }
                        allRichText.push([rt.build()]);
                    });
                });

                mergeTasks.push({ r: groupStartR, c: 1, rs: groupRowsCount, cs: 1 });
                mergeTasks.push({ r: groupStartR, c: 2, rs: groupRowsCount, cs: 1 });
                mergeTasks.push({ r: groupStartR, c: 3, rs: groupRowsCount, cs: 1 });
                countSTT++;
            };

            processGroup(logicTasks, "Implementation");
            processGroup(testCaseTasks, "Testcase");

            if (allDetailData.length > 0) {
                const range = detailSheet.getRange(startRowDetail, 1, allDetailData.length, 11);
                range.setValues(allDetailData);
                range.setBackgrounds(allBgs);
                range.setFontWeights(allWeights);
                range.setFontColors(allColors);
                range.setFontSizes(allSizes);
                range.setHorizontalAlignments(allHAligns);
                range.setVerticalAlignments(allVAligns);

                detailSheet.getRange(startRowDetail, 4, allRichText.length, 1).setRichTextValues(allRichText);

                rowHeights.forEach(rh => detailSheet.setRowHeight(rh.row, rh.height));
                mergeTasks.forEach(m => {
                    if (m.rs > 1 || m.cs > 1) {
                        try { detailSheet.getRange(m.r, m.c, m.rs, m.cs).merge(); } catch (e) { }
                    }
                });

                applyChipStyle(detailSheet.getRange(startRowDetail, 7, allDetailData.length, 1), "PM_STATUS");
                applyChipStyle(detailSheet.getRange(startRowDetail, 9, allDetailData.length, 1), "PRIORITY");
                applyChipStyle(detailSheet.getRange(startRowDetail, 10, allDetailData.length, 1), "COMPLEX");
                range.setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);
            }
        });

        const docId = e.parameter.docId;
        const docTabId = e.parameter.docTabId;
        const userVersion = e.parameter.version || null;
        const userDesc = e.parameter.summary || null;

        if (docId && epics.length > 0) {
            writeToGoogleDoc(docId, epics, docTabId, userVersion, userDesc);
        }


        return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    } catch (err) {
        return ContentService.createTextOutput("Error: " + err.toString());
    }
}

// =====================
// getOrCreateDetailSheet (GIỮ NGUYÊN)
// =====================
function getOrCreateDetailSheet(ss, rawCode) {
    let cleanCode = rawCode ? rawCode.toString().trim() : "NEW_TASK";
    let fullSheetName = cleanCode + ".Details";

    if (fullSheetName.length > 31) {
        fullSheetName = cleanCode.substring(0, 31 - 8) + ".Details";
    }

    let targetSheet = ss.getSheetByName(fullSheetName);

    if (!targetSheet) {
        let template = ss.getSheetByName("TEMPLATE");
        if (template) {
            targetSheet = template.copyTo(ss).setName(fullSheetName);
            targetSheet.showSheet();

            ss.setActiveSheet(targetSheet);
            ss.moveActiveSheet(ss.getNumSheets());
        } else {
            targetSheet = ss.insertSheet(fullSheetName);
        }
    }
    return targetSheet;
}

// =====================
// updateSprintSheet (GIỮ NGUYÊN)
// =====================
function updateSprintSheet(ss, epics, currentEpicStt) {
    const sprintSheet = ss.getSheetByName(CONFIG.SPRINT_SHEET_NAME);
    if (!sprintSheet) return;

    epics.forEach((epicObj, eIdx) => {
        const epicNum = currentEpicStt + eIdx + 1;
        let epicTitle = `${epicNum}. ${epicObj.epicName || "N/A"}`;

        // --- FIX: Filter out test cases from Sprint Sheet ---
        const sprintTasksData = (epicObj.tasks || []).filter(t => t.isTestCase !== true);
        if (sprintTasksData.length === 0) return;

        let lastRowS = sprintSheet.getLastRow();
        let startRow = Math.max(lastRowS + 1, CONFIG.SPRINT_START_ROW);
        let rowCount = sprintTasksData.length;

        // Batch write header info for Sprint Sheet
        let sprintHeaderData = [];
        for (let i = 0; i < rowCount; i++) {
            sprintHeaderData.push([epicNum, epicObj.epicCode || "", epicTitle]);
        }
        const sprintHeaderRange = sprintSheet.getRange(startRow, 1, rowCount, 3);
        sprintHeaderRange.setValues(sprintHeaderData);

        if (rowCount > 1) {
            sprintHeaderRange.setVerticalAlignment("middle");
            sprintSheet.getRange(startRow, 1, rowCount, 1).merge().setHorizontalAlignment("center");
            sprintSheet.getRange(startRow, 2, rowCount, 1).merge();
            sprintSheet.getRange(startRow, 3, rowCount, 1).merge();
        } else {
            sprintSheet.getRange(startRow, 1).setHorizontalAlignment("center");
        }

        const sprintData = sprintTasksData.map((t, idx) => {
            const subCount = (t.subTasks || []).length;
            const effort = subCount * (parseFloat(t.timeValue) || 0);
            return [
                `${epicNum}.${idx + 1}. ${t.mainTask}`,
                formatDate(t.startDate),
                formatDate(t.endDate),
                formatDate(t.delayDate),
                formatDate(t.finishedDate),
                t.pointsDev,
                subCount,
                formatTimeValue(effort)
            ];
        });

        sprintSheet.getRange(startRow, 4, rowCount, 8).setValues(sprintData);

        const pDevRange = sprintSheet.getRange(startRow, 9, rowCount, 1);
        pDevRange.setBackground("#E9E8E8").setFontColor("black").setHorizontalAlignment("center");
        pDevRange.setDataValidation(
            SpreadsheetApp.newDataValidation().requireValueInList(["1", "2", "3", "4", "5", "6", "7", "N/A"]).build()
        );

        sprintSheet
            .getRange(startRow, 1, rowCount, 11)
            .setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);

        const effortRange = sprintSheet.getRange(startRow, 11, rowCount, 1);
        effortRange.setHorizontalAlignment("right");
    });
}
