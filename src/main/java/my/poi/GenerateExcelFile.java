package my.poi;

import java.io.IOException;

public interface GenerateExcelFile {
    void generateXLSX() throws IOException;

    void setFullFileName(String fileName);

    String getFullFileName();

}
