package my.poi;

import lombok.Builder;
import lombok.Data;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Data
@Builder
public class XSSF extends AbstractGenerateExcelFile {

    @Override
    protected Workbook getWorkbook() {
        return new XSSFWorkbook();
    }
}
