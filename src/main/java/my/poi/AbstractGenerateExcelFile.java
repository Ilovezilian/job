package my.poi;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import static my.poi.Constant.*;

@Data
public abstract class AbstractGenerateExcelFile implements GenerateExcelFile {

    private String fullFileName = "";
    private int sheetNum = 1;
    private int rowNum = 10;
    private int columnNum = 10;

    /**
     * 默认一个表格，表格中10行 10列
     *
     * @throws IOException
     */
    @Override
    public void generateExcel() throws IOException {
        try (OutputStream out = new FileOutputStream(getFullFileName());
             Workbook workbook = generateSheet(sheetNum, rowNum, columnNum)) {
            workbook.write(out);
        }
    }

    @Override
    public void generateExcel(Workbook workbook) throws IOException {
        try (OutputStream out = new FileOutputStream(getFullFileName())) {
            workbook.write(out);
            workbook.close();
        }
    }

    /**
     * 这里不会出现多线程问题，因为这里不出现多个线程同时修改fullFileName的情况，我这里纯粹是画蛇添足，因为想到双校验单例就写。
     *
     * @return
     */
    public String getFullFileName() {
        if (null == fullFileName || "".equals(fullFileName)) {
            setFullFileName("default");
        }

        return fullFileName;
    }

    /**
     * 支持拓展部分文件名
     *
     * @param fileName 建议是文件名+时间戳
     * @return
     */
    public void setFullFileName(String fileName) {
        String suffix = this instanceof HSSF ? XLS_SUFFIX : XLSX_SUFFIX;
        this.fullFileName = FILE_PATH + FILE_NAME_PREFIX + this.getClass().getName()
                + rowNum + "-" + sheetNum + SEPARATOR + fileName
                + SEPARATOR + System.currentTimeMillis() + suffix;
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
