package my.poi;

import java.io.IOException;

public interface GenerateExcelFile {
    public void generateXLSX(int sheetNum, int rowNum, int column) throws IOException;
}
