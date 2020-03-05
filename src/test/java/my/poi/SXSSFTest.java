package my.poi;

import java.io.IOException;

public class SXSSFTest {
    public static void main(String[] args) throws IOException, InterruptedException {
        Thread.sleep(3 * 1000);
        (new SXSSF()).generateXLSX(8, 5000, 500);
        return;
    }
}