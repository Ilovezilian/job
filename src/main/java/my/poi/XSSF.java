package my.poi;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
public class XSSF extends AbstractGenerateExcelFile {

    @Override
    protected Workbook getWorkbook() {
        return new XSSFWorkbook();
    }
}
