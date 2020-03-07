package my.poi;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.OutputStream;

import static my.poi.SpreadSheetDemo.createCell;

public class SpreadSheetTest {
    public static void main(String[] args) throws Exception {

        Workbook wb = new XSSFWorkbook(); //or new HSSFWorkbook();
        Sheet sheet = wb.createSheet();
        Row row = sheet.createRow(2);
        row.setHeightInPoints(30);
        createCell(wb, row, 0, HorizontalAlignment.CENTER, VerticalAlignment.BOTTOM);
        createCell(wb, row, 1, HorizontalAlignment.CENTER_SELECTION, VerticalAlignment.BOTTOM);
        createCell(wb, row, 2, HorizontalAlignment.FILL, VerticalAlignment.CENTER);
        createCell(wb, row, 3, HorizontalAlignment.GENERAL, VerticalAlignment.CENTER);
        createCell(wb, row, 4, HorizontalAlignment.JUSTIFY, VerticalAlignment.JUSTIFY);
        createCell(wb, row, 5, HorizontalAlignment.LEFT, VerticalAlignment.TOP);
        createCell(wb, row, 6, HorizontalAlignment.RIGHT, VerticalAlignment.TOP);
        // Write the output to a file
        try (OutputStream fileOut = new FileOutputStream("xssf-align.xlsx")) {
            wb.write(fileOut);
        }
        wb.close();
    }

}
