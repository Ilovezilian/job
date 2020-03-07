package my.poi;

import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.Name;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFDataValidationConstraint;
import org.apache.poi.xssf.usermodel.XSSFDataValidationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;

public class XSSFDateValidationDemo {

    public void furtherDataValidations() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Data Validation");
            DataValidationHelper dvHelper = new XSSFDataValidationHelper(sheet);

            /**
             * Integer range check CTDataValidation
             */
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 100);
            DataValidationConstraint dvConstraint = dvHelper.createNumericConstraint(
                    XSSFDataValidationConstraint.ValidationType.INTEGER,
                    XSSFDataValidationConstraint.OperatorType.BETWEEN, "10", "100");
            DataValidation dataValidation = dvHelper.createValidation(dvConstraint, addressList);
            dataValidation.setSuppressDropDownArrow(false);
            dataValidation.setShowErrorBox(true);
            sheet.addValidationData(dataValidation);

            /**
             * Integer formulas
             */
            addressList = new CellRangeAddressList(1, 1, 0, 100);
            dvConstraint = dvHelper.createNumericConstraint(
                    XSSFDataValidationConstraint.ValidationType.INTEGER,
                    XSSFDataValidationConstraint.OperatorType.BETWEEN, "=SUM(A1:A10)", "=SUM(B20:B27)");
            dataValidation = dvHelper.createValidation(dvConstraint, addressList);
            dataValidation.setSuppressDropDownArrow(false);
            dataValidation.setShowErrorBox(true);
            sheet.addValidationData(dataValidation);


            /**
             * Creating Data Validations From Spreadsheet Cells.
             * and in both cases the user will be able to select from a drop down list containing the values from cells A1, A2 and A3.
             */
            dvConstraint = dvHelper.createFormulaListConstraint("$A$1:$A$3");

            /**
             * equals above
             */
            Name namedRange = workbook.createName();
            namedRange.setNameName("list1");
            namedRange.setRefersToFormula("$A$1:$A$3");
            dvConstraint = dvHelper.createFormulaListConstraint("list1");

            /**
             * The data does not have to be as the data validation. To select the data from a different sheet however,
             * the sheet must be given a name when created and that name should be used in the formula.
             * So assuming the existence of a sheet named 'Data Sheet' this will work:
             */

            namedRange = workbook.createName();
            namedRange.setNameName("list2");
            namedRange.setRefersToFormula("'Data Sheet'!$A$1:$A$3");
            dvConstraint = dvHelper.createFormulaListConstraint("list2");

            dvConstraint = dvHelper.createFormulaListConstraint("'Data Sheet'!$A$1:$A$3");

            XSSF xssf = new XSSF();
            xssf.setFullFileName("furtherDataValidations");
            xssf.generateExcel(workbook);
        }
    }

    /**
     * To create a prompt that the user will see when the cell containing the data validation receives focus
     *
     * @throws IOException
     */
    public void prompts() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Data Validation");
            DataValidationHelper dvHelper = new XSSFDataValidationHelper(sheet);
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);
            DataValidationConstraint dvConstraint = dvHelper.createExplicitListConstraint(new String[]{"10", "20", "30"});
            DataValidation dataValidation = dvHelper.createValidation(dvConstraint, addressList);
            dataValidation.setSuppressDropDownArrow(false);
            dataValidation.setShowErrorBox(false);
            dataValidation.setShowPromptBox(true);
            dataValidation.createPromptBox("Warn Title", "You wrong and call daddy to save your little life!");
            sheet.addValidationData(dataValidation);

            XSSF xssf = new XSSF();
            xssf.setFullFileName("prompts");
            xssf.generateExcel(workbook);
        }
    }

    /**
     * To create a message box that will be shown to the user if the value they enter is invalid.
     *
     * @throws IOException
     */
    public void messagesOnError() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Data Validation");
            XSSFDataValidationHelper dvHelper = new XSSFDataValidationHelper(sheet);
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);
            DataValidationConstraint dvConstraint = dvHelper.createExplicitListConstraint(new String[]{"10", "20", "30"});
            DataValidation dataValidation = dvHelper.createValidation(dvConstraint, addressList);
            dataValidation.setSuppressDropDownArrow(true);
            dataValidation.setShowErrorBox(true);
            dataValidation.setErrorStyle(DataValidation.ErrorStyle.STOP);
            dataValidation.createErrorBox("Warn Title", "You wrong and call daddy to save you!");
            sheet.addValidationData(dataValidation);

            XSSF xssf = new XSSF();
            xssf.setFullFileName("messagesOnError");
            xssf.generateExcel(workbook);
        }
    }

    /**
     * This code will do the same as bellow but offer the user a drop down list to select a value from.
     *
     * @throws IOException
     */
    public void dropDownLists() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Data Validation");
            DataValidationHelper dvHelper = new XSSFDataValidationHelper(sheet);
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);
            DataValidationConstraint dvConstraint = dvHelper.createExplicitListConstraint(new String[]{"10", "20", "30"});
            DataValidation dataValidation = dvHelper.createValidation(dvConstraint, addressList);
            dataValidation.setSuppressDropDownArrow(true);
            //            dataValidation.setShowErrorBox(false);
            sheet.addValidationData(dataValidation);

            XSSF xssf = new XSSF();
            xssf.setFullFileName("dropDownLists");
            xssf.generateExcel(workbook);
        }
    }


    /**
     * The following code will limit the value the user can enter into cell A1 to one of three integer values, 10, 20 or 30.
     *
     * @throws IOException
     */
    public void checkValue() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Data Validation");
            DataValidationHelper dvHelper = new XSSFDataValidationHelper(sheet);
            DataValidationConstraint dvConstraint = dvHelper.createExplicitListConstraint(new String[]{"11", "21", "31"});
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);
            DataValidation validation = dvHelper.createValidation(dvConstraint, addressList);
            // Here the boolean value false is passed to the setSuppressDropDownArrow()
            // method. In the xssf.usermodel examples above, the value passed to this
            // method is true.
            validation.setSuppressDropDownArrow(true);
            // Note this extra method call. If this method call is omitted, or if the
            // boolean value false is passed, then Excel will not validate the value the
            // user enters into the cell.
            validation.setShowErrorBox(true);
            sheet.addValidationData(validation);

            XSSF xssf = new XSSF();
            xssf.setFullFileName("checkValue");
            xssf.generateExcel(workbook);
        }
    }


}
