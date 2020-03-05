package my.poi;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import static my.poi.Constant.*;

public abstract class AbstractGenerateExcelFile implements GenerateExcelFile {

    private volatile String fullFileName;

    @Override
    public void generateXLSX(int sheetNum, int rowNum, int column) throws IOException {
        OutputStream out = new FileOutputStream(getFullFileName(sheetNum, rowNum));
        Workbook workbook = generateSheet(sheetNum, rowNum, column);
        workbook.write(out);
        workbook.close();
        out.close();
    }

    /**
     * 这里不会出现多线程问题，因为这里不出现多个线程同时修改fullFileName的情况，我这里纯粹是画蛇添足，因为想到双校验单例就写。
     * @param sheetNum
     * @param rowNum
     * @return
     */
    private String getFullFileName(int sheetNum, int rowNum) {
        if (null == fullFileName || "".equals(fullFileName)) {
            fullFileName = FILE_PATH + FILE_NAME_PREFIX + (rowNum * sheetNum) + SEPARATOR + System.currentTimeMillis() + FILE_NAME_SUFFIX;
        }

        return fullFileName;
    }

    /**
     * 支持拓展部分文件名
     * @param sheetNum
     * @param rowNum
     * @param random 建议是文件名+时间戳
     * @return
     */
    protected void setFullFileName(int sheetNum, int rowNum, String random) {
        this.fullFileName = FILE_PATH + FILE_NAME_PREFIX + (rowNum * sheetNum) + SEPARATOR + random + SEPARATOR + System.currentTimeMillis() + FILE_NAME_SUFFIX;
    }


    private Workbook generateSheet(int sheetNum, int rowNum, int column) throws IOException {
        Workbook workbook = getWorkbook();
        for (int sheetIndex = 0; sheetIndex < sheetNum; sheetIndex++) {
            String sheetName = SHEET_NAME_PREFIX + SEPARATOR + sheetIndex;
            Sheet sheet = workbook.createSheet(sheetName);
            for (int i = 0; i < rowNum; i++) {
                Row row = sheet.createRow(i);
                for (int j = 0; j < column; j++) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(sheetName + "-" + i + "-" + j);
                }
            }
        }
        return workbook;
    }

    protected abstract Workbook getWorkbook();

}
