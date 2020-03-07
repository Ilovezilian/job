package my.poi;

import lombok.Builder;
import lombok.Data;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

@Data
@Builder
public class SXSSF extends AbstractGenerateExcelFile {
    @Override
    protected Workbook getWorkbook() {
        return new SXSSFWorkbook();
    }
}
