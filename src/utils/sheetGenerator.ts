import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ProcessedImage } from './pixelProcessor';

export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface SheetOptions {
  ignoreCaps: boolean;
  ignoreSpaces: boolean;
  ignoreAccents: boolean;
  customInstructions?: string;
}

// Helper to generate nested SUBSTITUTE formula for accents
function generateAccentNormalization(cellRef: string): string {
  const mappings = [
    ['á', 'a'], ['é', 'e'], ['í', 'i'], ['ó', 'o'], ['ú', 'u'],
    ['à', 'a'], ['è', 'e'], ['ì', 'i'], ['ò', 'o'], ['ù', 'u'],
    ['â', 'a'], ['ê', 'e'], ['î', 'i'], ['ô', 'o'], ['û', 'u'],
    ['ä', 'a'], ['ë', 'e'], ['ï', 'i'], ['ö', 'o'], ['ü', 'u'],
    ['ñ', 'n'], ['ç', 'c'], ['ý', 'y'], ['ÿ', 'y']
  ];

  let formula = cellRef;
  mappings.forEach(([char, replacement]) => {
    formula = `SUBSTITUTE(${formula},"${char}","${replacement}")`;
  });
  return formula;
}

export async function generatePixelArtSheet(
  image: ProcessedImage,
  questions: Question[],
  fileName: string = 'SheetsQuest_Activity.xlsx',
  options: SheetOptions = { ignoreCaps: true, ignoreSpaces: true, ignoreAccents: false }
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Pixel Art Activity', {
    views: [{ showGridLines: false }] // Hide default gridlines
  });
  
  // --- LAYOUT CONSTANTS ---
  const rowsPerQuestion = 4; // 3 content + 1 gap
  const questionsPerColumn = Math.max(1, Math.floor(image.height / rowsPerQuestion));
  const questionBlockWidth = 4; // Q#, Text, Input, Spacer
  const numQuestionColumns = Math.ceil(questions.length / questionsPerColumn);
  
  // Alternating layout: left columns, pixel art, right columns, etc.
  // 1st batch: left, 2nd batch: right, 3rd batch: left, 4th batch: right
  const leftBatches = Math.ceil(numQuestionColumns / 2);
  const rightBatches = Math.floor(numQuestionColumns / 2);
  
  // Calculate positions
  const leftQuestionsStart = 2; // Column B
  const leftQuestionsEnd = leftQuestionsStart + (leftBatches * questionBlockWidth) - 1;
  
  const pixelStartCol = leftQuestionsEnd + 2; // Spacer after left questions
  const pixelEndCol = pixelStartCol + image.width - 1;
  
  const rightQuestionsStart = pixelEndCol + 2; // Spacer after pixel art
  const rightQuestionsEnd = rightQuestionsStart + (rightBatches * questionBlockWidth) - 1;
  
  // Buffer Columns (after all content)
  const contentEnd = Math.max(rightQuestionsEnd, pixelEndCol);
  const normalBufferStart = contentEnd + 1;
  const normalBufferEnd = normalBufferStart + 9; // 10 columns
  
  const zeroWidthBufferStart = normalBufferEnd + 1;
  const zeroWidthBufferEnd = zeroWidthBufferStart + 19; // 20 columns
  
  // Formula Columns (Hidden) - increased from 5 to 10
  const formulaStart = zeroWidthBufferEnd + 1;
  const formulaEnd = formulaStart + 9; // 10 columns
  
  // Logic & Answer Mapping
  // We will stack logic/answers in the formula columns
  // Col 1: Logic (TRUE/FALSE)
  // Col 2: Answer Key
  const hiddenLogicCol = formulaStart;
  const hiddenAnswerCol = formulaStart + 1;

  // 1. Setup Columns
  sheet.getColumn(1).width = 2; // Margin
  // Left Question Columns
  for (let b = 0; b < leftBatches; b++) {
    const start = leftQuestionsStart + (b * questionBlockWidth);
    sheet.getColumn(start).width = 4;     // Q#
    sheet.getColumn(start + 1).width = 35; // Text
    sheet.getColumn(start + 2).width = 20; // Input
    sheet.getColumn(start + 3).width = 2;  // Spacer
  }

  // Spacer before pixel art
  if (leftBatches > 0) {
    sheet.getColumn(pixelStartCol - 1).width = 2;
  }


  // Pixel Art Columns
  // Row height for pixel rows in points — defined here for use in column width calculation.
  const pixelRowHeight = 9;
  // For square pixel cells, column width (in chars) must match row height (in pts).
  // pixel_height_px = pixelRowHeight * (4/3); pixel_width_px = colWidth * MDW (MDW ≈ 7px for Calibri 11pt)
  // For square: colWidth = pixelRowHeight * (4/3) / 7
  const pixelColWidth = parseFloat((pixelRowHeight * (4 / 3) / 7).toFixed(2));
  for (let i = 0; i < image.width; i++) {
    const col = sheet.getColumn(pixelStartCol + i);
    col.width = pixelColWidth;
  }

  // Spacer after pixel art
  if (rightBatches > 0) {
    sheet.getColumn(rightQuestionsStart - 1).width = 2;
  }

  // Right Question Columns
  for (let b = 0; b < rightBatches; b++) {
    const start = rightQuestionsStart + (b * questionBlockWidth);
    sheet.getColumn(start).width = 4;     // Q#
    sheet.getColumn(start + 1).width = 35; // Text
    sheet.getColumn(start + 2).width = 20; // Input
    sheet.getColumn(start + 3).width = 2;  // Spacer
  }

  // Normal Buffer Columns
  for (let i = normalBufferStart; i <= normalBufferEnd; i++) {
    sheet.getColumn(i).width = 8.43; // Standard Excel width
  }

  // Zero-Width Buffer Columns (tiny width, ~1/4 of a normal column total)
  for (let i = zeroWidthBufferStart; i <= zeroWidthBufferEnd; i++) {
    const col = sheet.getColumn(i);
    col.width = 0.1;
  }

  // Formula Columns (Hidden)
  for (let i = formulaStart; i <= formulaEnd; i++) {
    const col = sheet.getColumn(i);
    col.width = 0;
    col.hidden = true;
  }

  // 2. Title & Header (span entire content area)
  const titleStart = leftBatches > 0 ? leftQuestionsStart : pixelStartCol;
  const titleEnd = contentEnd;
  sheet.mergeCells(2, titleStart, 3, titleEnd); 
  const titleCell = sheet.getCell(2, titleStart);
  titleCell.value = fileName.replace('.xlsx', '');
  titleCell.font = { size: 24, bold: true, color: { argb: 'FF0F172A' }, name: 'Arial' };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(2).height = 30;
  sheet.getRow(3).height = 30;

  sheet.mergeCells(4, titleStart, 4, titleEnd);
  const instrCell = sheet.getCell(4, titleStart);
  instrCell.value = options.customInstructions
    ? options.customInstructions
    : "Instructions: Type your answers in the boxes. Correct answers reveal the picture!";
  instrCell.font = { size: 11, italic: true, color: { argb: 'FF64748B' }, name: 'Arial' };
  instrCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
  sheet.getRow(4).height = 30;

  // 4. Row Heights & Pixel Art Setup
  const startRow = 6;
  const totalRows = Math.max(image.height, questionsPerColumn * 4) + 10;

  for (let i = 0; i < totalRows; i++) {
    const row = sheet.getRow(startRow + i);
    row.height = pixelRowHeight;
  }

  // 5. Render Questions & Inputs
  const questionContentHeight = 3;
  const borderStyle = { style: 'medium', color: { argb: 'FF000000' } } as const;
  let nextConditionalPriority = 1;
  
  const questionLogicMap: Record<string, string> = {};

  questions.forEach((q, i) => {
    // Determine Batch and Position (alternating left/right)
    const batchIndex = Math.floor(i / questionsPerColumn);
    const isLeftBatch = batchIndex % 2 === 0; // 0, 2, 4... are left
    const batchOffset = Math.floor(batchIndex / 2); // 0, 0, 1, 1, 2, 2...
    
    const rowIndex = i % questionsPerColumn;
    
    const qRowStart = startRow + (rowIndex * rowsPerQuestion);
    const qRowEnd = qRowStart + questionContentHeight - 1;
    
    // Calculate Column Start for this batch (alternating)
    const qColStart = isLeftBatch 
      ? leftQuestionsStart + (batchOffset * questionBlockWidth)
      : rightQuestionsStart + (batchOffset * questionBlockWidth);
    
    // Q#
    sheet.mergeCells(qRowStart, qColStart, qRowEnd, qColStart);
    const numCell = sheet.getCell(qRowStart, qColStart);
    numCell.value = `${i + 1}.`;
    numCell.font = { bold: true, color: { argb: 'FF64748B' }, size: 12 };
    numCell.alignment = { vertical: 'top', horizontal: 'center' };

    // Question Text
    sheet.mergeCells(qRowStart, qColStart + 1, qRowEnd, qColStart + 1);
    const qCell = sheet.getCell(qRowStart, qColStart + 1);
    qCell.value = q.text;
    qCell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
    qCell.font = { size: 11, color: { argb: 'FF334155' } };
    qCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    qCell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    // Answer Input
    sheet.mergeCells(qRowStart, qColStart + 2, qRowEnd, qColStart + 2);
    const aCell = sheet.getCell(qRowStart, qColStart + 2);
    aCell.alignment = { vertical: 'middle', horizontal: 'center' };
    aCell.font = { bold: true, color: { argb: 'FF0F172A' }, size: 11 };
    aCell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } }
    };
    aCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

    // --- HIDDEN ANSWER STORE ---
    // Stack them in the formula columns
    const hiddenAnswerCell = sheet.getCell(qRowStart, hiddenAnswerCol);
    hiddenAnswerCell.value = q.answer;
    
    // --- LOGIC FORMULA ---
    const logicCell = sheet.getCell(qRowStart, hiddenLogicCol);
    
    let inputPart = aCell.address; 
    let answerPart = hiddenAnswerCell.address; 

    // Apply LOWER first so uppercase accented chars (e.g. É) become lowercase
    // before accent SUBSTITUTE mappings (which only cover lowercase accented chars).
    if (options.ignoreCaps || options.ignoreAccents) {
      inputPart = `LOWER(${inputPart})`;
      answerPart = `LOWER(${answerPart})`;
    }
    if (options.ignoreAccents) {
      inputPart = generateAccentNormalization(inputPart);
      answerPart = generateAccentNormalization(answerPart);
    }
    if (options.ignoreSpaces) {
      inputPart = `TRIM(${inputPart})`;
      answerPart = `TRIM(${answerPart})`;
    }

    logicCell.value = {
      formula: `AND(${answerPart}<>"",${inputPart}=${answerPart})`
    };
    
    // Store ABSOLUTE address for pixel art rules
    const colLetter = sheet.getColumn(logicCell.col).letter;
    const absLogicRef = `$${colLetter}$${logicCell.row}`;
    questionLogicMap[q.id] = absLogicRef;

    // --- CONDITIONAL FORMATTING FOR INPUT ---
    
    // 1. Green if Correct
    sheet.addConditionalFormatting({
      ref: aCell.address,
      rules: [
        {
          type: 'expression',
          priority: nextConditionalPriority++,
          formulae: [`${absLogicRef}=TRUE`], 
          style: {
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } },
            font: { color: { argb: 'FF166534' }, bold: true },
            border: {
              top: { style: 'medium', color: { argb: 'FF16A34A' } },
              bottom: { style: 'medium', color: { argb: 'FF16A34A' } },
              left: { style: 'medium', color: { argb: 'FF16A34A' } },
              right: { style: 'medium', color: { argb: 'FF16A34A' } }
            }
          }
        }
      ]
    });

    // 2. Red if Wrong AND Not Blank
    sheet.addConditionalFormatting({
      ref: aCell.address,
      rules: [
        {
          type: 'expression',
          priority: nextConditionalPriority++,
          formulae: [`AND(NOT(ISBLANK(${aCell.address})), ${absLogicRef}<>TRUE)`], 
          style: {
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } },
            font: { color: { argb: 'FF991B1B' }, bold: true },
            border: {
              top: { style: 'medium', color: { argb: 'FFEF4444' } },
              bottom: { style: 'medium', color: { argb: 'FFEF4444' } },
              left: { style: 'medium', color: { argb: 'FFEF4444' } },
              right: { style: 'medium', color: { argb: 'FFEF4444' } }
            }
          }
        }
      ]
    });
    
    // Borders for this question block
    
    // Top of block
    sheet.getCell(qRowStart, qColStart).border = { ...sheet.getCell(qRowStart, qColStart).border, top: borderStyle };
    sheet.getCell(qRowStart, qColStart + 1).border = { ...sheet.getCell(qRowStart, qColStart + 1).border, top: borderStyle };
    sheet.getCell(qRowStart, qColStart + 2).border = { ...sheet.getCell(qRowStart, qColStart + 2).border, top: borderStyle };

    // Bottom of block
    sheet.getCell(qRowEnd, qColStart).border = { ...sheet.getCell(qRowEnd, qColStart).border, bottom: borderStyle };
    sheet.getCell(qRowEnd, qColStart + 1).border = { ...sheet.getCell(qRowEnd, qColStart + 1).border, bottom: borderStyle };
    sheet.getCell(qRowEnd, qColStart + 2).border = { ...sheet.getCell(qRowEnd, qColStart + 2).border, bottom: borderStyle };
    
    // Left of block
    for(let r=qRowStart; r<=qRowEnd; r++) {
        const c = sheet.getCell(r, qColStart);
        c.border = { ...c.border, left: borderStyle };
    }
    
    // Right of block
    for(let r=qRowStart; r<=qRowEnd; r++) {
        const c = sheet.getCell(r, qColStart + 2);
        c.border = { ...c.border, right: borderStyle };
    }
  });

  // 6. Border around Questions Area - REMOVED as we now border each question individually
  // (The loop above handles it)



  // 7. Pixel Art Logic (Round Robin Distribution)
  const allCoords: [number, number][] = [];
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      allCoords.push([y, x]);
    }
  }

  // Shuffle
  for (let i = allCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCoords[i], allCoords[j]] = [allCoords[j], allCoords[i]];
  }

  // Prepare buckets for each question
  const questionPixels: Record<string, [number, number][]> = {};
  questions.forEach(q => {
    questionPixels[q.id] = [];
  });

  // Round-robin assignment
  allCoords.forEach((coord, index) => {
    const questionIndex = index % questions.length;
    const question = questions[questionIndex];
    questionPixels[question.id].push(coord);
  });

  // Apply formatting
  questions.forEach(q => {
    const assignedCoords = questionPixels[q.id];
    const logicRef = questionLogicMap[q.id];
    
    const pixelsByColor: Record<string, string[]> = {};

    assignedCoords.forEach(([y, x]) => {
      const cell = sheet.getCell(startRow + y, pixelStartCol + x);
      
      // Set default background to light grey so white pixels are visible when revealed
      // (otherwise they would be white-on-white and look like they are missing)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF1F5F9' } // Slate-100
      };

      const color = image.grid[y][x].hex.replace('#', '');
      
      if (!pixelsByColor[color]) {
        pixelsByColor[color] = [];
      }
      pixelsByColor[color].push(cell.address);
    });

    Object.entries(pixelsByColor).forEach(([color, addresses]) => {
      // Batch in chunks to avoid formula length limits
      const chunkSize = 50;
      for (let i = 0; i < addresses.length; i += chunkSize) {
        const chunk = addresses.slice(i, i + chunkSize);
        const ref = chunk.join(' '); // Use space separator for OOXML sqref format
        
        sheet.addConditionalFormatting({
          ref: ref,
          rules: [
            {
              type: 'expression',
              priority: nextConditionalPriority++,
              formulae: [`${logicRef}=TRUE`],
              style: {
                fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FF' + color }
                }
              }
            }
          ]
        });
      }
    });
  });

  // 8. Border around the entire pixel art area
  // Top & Bottom Edge
  for (let x = 0; x < image.width; x++) {
    const topCell = sheet.getCell(startRow, pixelStartCol + x);
    topCell.border = { ...topCell.border, top: borderStyle };
    
    const bottomCell = sheet.getCell(startRow + image.height - 1, pixelStartCol + x);
    bottomCell.border = { ...bottomCell.border, bottom: borderStyle };
  }

  // Left & Right Edge
  for (let y = 0; y < image.height; y++) {
    const leftCell = sheet.getCell(startRow + y, pixelStartCol);
    leftCell.border = { ...leftCell.border, left: borderStyle };
    
    const rightCell = sheet.getCell(startRow + y, pixelEndCol);
    rightCell.border = { ...rightCell.border, right: borderStyle };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
}
