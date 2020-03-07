package my.poi;

import java.io.IOException;

public class XSSFTest {
    public static void main(String[] args) throws IOException, InterruptedException {
        Thread.sleep(3 * 1000);
        (new XSSF()).generateExcel();
    }

}