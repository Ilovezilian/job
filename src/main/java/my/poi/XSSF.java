package my.poi;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class XSSF extends AbstractGenerateExcelFile {

    @Override
    protected Workbook getWorkbook() {
        return new XSSFWorkbook();
    }
}
