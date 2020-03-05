package my.poi;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

public class SXSSF extends AbstractGenerateExcelFile {
    @Override
    protected Workbook getWorkbook() {
        return new SXSSFWorkbook();
    }
}
