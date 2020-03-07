package my.poi;

import lombok.Builder;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

@Builder
public class HSSF extends AbstractGenerateExcelFile {

    @Override
    protected Workbook getWorkbook() {
        return new HSSFWorkbook();
    }
}
