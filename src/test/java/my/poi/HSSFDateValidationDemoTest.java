package my.poi;

import org.testng.annotations.Test;

import java.io.IOException;

public class HSSFDateValidationDemoTest {

    @Test
    public void testCheckValue() throws IOException {
        System.out.println("start");
        new HSSFDateValidationDemo().checkValue();
        System.out.println("end");
    }

    @Test
    public void testDropDownLists() throws IOException {
        System.out.println("start");
        new HSSFDateValidationDemo().dropDownLists();
        System.out.println("end");
    }

    @Test
    public void testMessagesOnError() throws IOException {
        System.out.println("start");
        new HSSFDateValidationDemo().messagesOnError();
        System.out.println("end");
    }

    @Test
    public void testPrompts() throws IOException {
        System.out.println("start");
        new HSSFDateValidationDemo().prompts();
        System.out.println("end");
    }

    @Test
    public void testFurtherDataValidations() throws IOException {
        System.out.println("start");
        new HSSFDateValidationDemo().furtherDataValidations();
        System.out.println("end");
    }
}