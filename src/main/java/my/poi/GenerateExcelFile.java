package my.poi;

import java.io.IOException;

public interface GenerateExcelFile {
    void generateXLSX() throws IOException;

    void generateXLSX(int sheetNum, int rowNum, int column) throws IOException;

    void setFullFileName(int sheetNum, int rowNum, String random);

    String getFullFileName();

    String getFullFileName(int sheetNum, int rowNum);
}
