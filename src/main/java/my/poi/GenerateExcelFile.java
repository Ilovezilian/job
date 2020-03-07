package my.poi;

import org.apache.poi.ss.usermodel.Workbook;

import java.io.IOException;

public interface GenerateExcelFile {
    void generateExcel() throws IOException;

    void generateExcel(Workbook workbook) throws IOException;

    void setFullFileName(String fileName);

    String getFullFileName();

}
