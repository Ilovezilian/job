package my.poi;

import org.apache.poi.hssf.extractor.ExcelExtractor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.WorkbookUtil;
import org.apache.poi.xssf.usermodel.XSSFHeaderFooterProperties;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.util.Date;

public class SpreadSheetDemo {
    public void CreateWorkBookSheet() throws IOException {
//        Workbook workbook = new HSSFWorkbook();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet1 = workbook.createSheet("sheet1");
        Row row = sheet1.createRow(0);
        Cell cell = row.createCell(0);
        cell.setCellValue(1);
        Cell cell1 = row.createCell(1);
        cell1.setCellValue(new Date());

        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setDataFormat((short) BuiltinFormats.getBuiltinFormat("m/d/yy h:mm"));
        Cell cell2 = row.createCell(2);
        cell2.setCellValue(2);
        cell2.setCellStyle(cellStyle);
        row.createCell(3).setCellType(CellType.ERROR);


        String sheetName = WorkbookUtil.createSafeSheetName("nidaye.xlsx");
        try (OutputStream stream = new FileOutputStream(sheetName)) {
            workbook.write(stream);
        }
    }

    public void CreateWorkBookSheetWithFactory() throws IOException, InvalidFormatException {
        // use a file
        Workbook workbook = WorkbookFactory.create(new File("myExcel.xlsx"));
        // use a inputStream need more memory for buffer
        Workbook workbook1 = WorkbookFactory.create(new FileInputStream("myExcel1.xlsx"));
    }

    /**
     * Creates a cell and aligns it a certain way.
     *
     * @param wb     the workbook
     * @param row    the row to create the cell in
     * @param column the column number to create the cell in
     * @param halign the horizontal alignment for the cell.
     * @param valign the vertical alignment for the cell.
     */
    static void createCell(Workbook wb, Row row, int column, HorizontalAlignment halign, VerticalAlignment valign) {
        Cell cell = row.createCell(column);
        cell.setCellValue("Align It");
        CellStyle cellStyle = wb.createCellStyle();
        cellStyle.setAlignment(halign);
        cellStyle.setVerticalAlignment(valign);
        cell.setCellStyle(cellStyle);
    }


    public void visitSpreadSheet(Workbook workbook) {
        StringBuffer sb = new StringBuffer("");
        for (Sheet sheet : workbook) {
            sb.append("\r\r");
            for (Row row : sheet) {
                sb.append("\r|");
                for (Cell cell : row) {
                    sb.append(cell.getStringCellValue() + " | ");
                }
            }
        }

        System.out.println("sb = " + sb);
    }

    public void ExtractText() throws IOException {
        try (InputStream inp = new FileInputStream("workbook.xls")) {
            HSSFWorkbook wb = new HSSFWorkbook(new POIFSFileSystem(inp));
            ExcelExtractor extractor = new ExcelExtractor(wb);
            extractor.setFormulasNotResults(true);
            extractor.setIncludeSheetNames(false);
            String text = extractor.getText();
            wb.close();
        }
    }

    public void dataFormats() throws IOException {
        try (Workbook wb = new HSSFWorkbook()) {
            Sheet sheet = wb.createSheet("format sheet");
            CellStyle style;
            DataFormat format = wb.createDataFormat();
            Row row;
            Cell cell;
            int rowNum = 0;
            int colNum = 0;
            row = sheet.createRow(rowNum++);
            cell = row.createCell(colNum);
            cell.setCellValue(11111.25);
            style = wb.createCellStyle();
            style.setDataFormat(format.getFormat("0.0"));
            cell.setCellStyle(style);
            row = sheet.createRow(rowNum++);
            cell = row.createCell(colNum);
            cell.setCellValue(11111.25);
            style = wb.createCellStyle();
            style.setDataFormat(format.getFormat("#,##0.0000"));
            cell.setCellStyle(style);
            try (OutputStream fileOut = new FileOutputStream("workbook.xls")) {
                wb.write(fileOut);
            }
        }
    }

    public void fitSheetTOOnePage() throws IOException {
        try (Workbook wb = new HSSFWorkbook()) {
            Sheet sheet = wb.createSheet("format sheet");
            PrintSetup ps = sheet.getPrintSetup();

            sheet.setAutobreaks(true);

            ps.setFitHeight((short) 1);
            ps.setFitWidth((short) 1);

            // Create various cells and rows for spreadsheet
            try (OutputStream fileOut = new FileOutputStream("workbook.xls")) {
                wb.write(fileOut);
            }
        }
    }

    public void enhancementHead() throws IOException {
        Workbook wb = new XSSFWorkbook();
        XSSFSheet sheet = (XSSFSheet) wb.createSheet("new sheet");
// Create a first page header
        Header header = sheet.getFirstHeader();
        header.setCenter("Center First Page Header");
        header.setLeft("Left First Page Header");
        header.setRight("Right First Page Header");
// Create an even page header
        Header header2 = sheet.getEvenHeader();
        header2.setCenter("Center Even Page Header");
        header2.setLeft("Left Even Page Header");
        header2.setRight("Right Even Page Header");
// Create an odd page header
        Header header3 = sheet.getOddHeader();
        header3.setCenter("Center Odd Page Header");
        header3.setLeft("Left Odd Page Header");
        header3.setRight("Right Odd Page Header");
// Set/Remove Header properties
        XSSFHeaderFooterProperties prop = sheet.getHeaderFooterProperties();
        prop.setAlignWithMargins(true);
        prop.setScaleWithDoc(true);
        prop.removeDifferentFirst(); // This does not remove first page headers or footers
        prop.removeDifferentOddEven();// This does not remove even headers or footers
        try (OutputStream fileOut = new FileOutputStream("workbook.xlsx")) {
            wb.write(fileOut);
        }
    }

}





















