package my.poi;

import java.io.IOException;

public class HSSFTest {
    public static void main(String[] args) throws IOException, InterruptedException {
        Thread.sleep(3 * 1000);
        (new HSSF()).generateExcel();
    }

}