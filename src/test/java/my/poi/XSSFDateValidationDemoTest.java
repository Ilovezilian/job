package my.poi;

import org.testng.annotations.Test;

import java.io.IOException;

public class XSSFDateValidationDemoTest {

    @Test
    public void testCheckValue() throws IOException {
        System.out.println("start");
        new XSSFDateValidationDemo().checkValue();
        System.out.println("end");
    }

    @Test
    public void testDropDownLists() throws IOException {
        System.out.println("start");
        new XSSFDateValidationDemo().dropDownLists();
        System.out.println("end");
    }

    @Test
    public void testMessagesOnError() throws IOException {
        System.out.println("start");
        new XSSFDateValidationDemo().messagesOnError();
        System.out.println("end");
    }

    @Test
    public void testPrompts() throws IOException {
        System.out.println("start");
        new XSSFDateValidationDemo().prompts();
        System.out.println("end");
    }

    @Test
    public void testFurtherDataValidations() throws IOException {
        System.out.println("start");
        new XSSFDateValidationDemo().furtherDataValidations();
        System.out.println("end");
    }
}