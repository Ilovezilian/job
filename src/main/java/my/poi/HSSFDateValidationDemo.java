package my.poi;

import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.Name;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddressList;

import java.io.IOException;

public class HSSFDateValidationDemo {

    public void furtherDataValidations() throws IOException {
        try (HSSFWorkbook workbook = new HSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data Validation");

            /**
             * Integer range check
             */
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 100);
            DVConstraint dvConstraint = DVConstraint.createNumericConstraint(
                    DVConstraint.ValidationType.INTEGER,
                    DVConstraint.OperatorType.BETWEEN, "10", "100");
            DataValidation dataValidation = new HSSFDataValidation(addressList, dvConstraint);
            dataValidation.setSuppressDropDownArrow(false);
            sheet.addValidationData(dataValidation);

            /**
             * Integer formulas
             */
            addressList = new CellRangeAddressList(1, 1, 0, 100);
            dvConstraint = DVConstraint.createNumericConstraint(
                    DVConstraint.ValidationType.INTEGER,
                    DVConstraint.OperatorType.BETWEEN, "=SUM(A1:A3)", "100");
            dataValidation = new HSSFDataValidation(addressList, dvConstraint);
            dataValidation.setSuppressDropDownArrow(false);
            sheet.addValidationData(dataValidation);

            /**
             * Creating Data Validations From Spreadsheet Cells.
             * and in both cases the user will be able to select from a drop down list containing the values from cells A1, A2 and A3.
             */
            dvConstraint = DVConstraint.createFormulaListConstraint("$A$1:$A$3");

            /**
             * equals above
             */
            Name namedRange = workbook.createName();
            namedRange.setNameName("list1");
            namedRange.setRefersToFormula("$A$1:$A$3");
            dvConstraint = DVConstraint.createFormulaListConstraint("list1");

            /**
             * The data does not have to be as the data validation. To select the data from a different sheet however,
             * the sheet must be given a name when created and that name should be used in the formula.
             * So assuming the existence of a sheet named 'Data Sheet' this will work:
             */

            namedRange = workbook.createName();
            namedRange.setNameName("list2");
            namedRange.setRefersToFormula("'Data Sheet'!$A$1:$A$3");
            dvConstraint = DVConstraint.createFormulaListConstraint("list2");

            dvConstraint = DVConstraint.createFormulaListConstraint("'Data Sheet'!$A$1:$A$3");


            HSSF hssf = new HSSF();
            hssf.setFullFileName("furtherDataValidations");
            hssf.generateExcel(workbook);
        }
    }

    /**
     * To create a prompt that the user will see when the cell containing the data validation receives focus
     *
     * @throws IOException
     */
    public void prompts() throws IOException {
        try (HSSFWorkbook workbook = new HSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data Validation");
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);
            DVConstraint dvConstraint = DVConstraint.createExplicitListConstraint(new String[]{"10", "20", "30"});
            DataValidation dataValidation = new HSSFDataValidation(addressList, dvConstraint);
            dataValidation.setSuppressDropDownArrow(false);
            dataValidation.setShowPromptBox(true);
            dataValidation.createPromptBox("Warn Title", "You wrong and call daddy to save your little life!");
            sheet.addValidationData(dataValidation);

            HSSF hssf = new HSSF();
            hssf.setFullFileName("prompts");
            hssf.generateExcel(workbook);
        }
    }

    /**
     * To create a message box that will be shown to the user if the value they enter is invalid.
     *
     * @throws IOException
     */
    public void messagesOnError() throws IOException {
        try (HSSFWorkbook workbook = new HSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data Validation");
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);
            DVConstraint dvConstraint = DVConstraint.createExplicitListConstraint(new String[]{"10", "20", "30"});
            DataValidation dataValidation = new HSSFDataValidation(addressList, dvConstraint);
            dataValidation.setSuppressDropDownArrow(false);
            dataValidation.setErrorStyle(DataValidation.ErrorStyle.STOP);
            dataValidation.createErrorBox("Warn Title", "You wrong and call daddy to save you!");
            sheet.addValidationData(dataValidation);

            HSSF hssf = new HSSF();
            hssf.setFullFileName("messagesOnError");
            hssf.generateExcel(workbook);
        }
    }

    /**
     * This code will do the same as bellow but offer the user a drop down list to select a value from.
     *
     * @throws IOException
     */
    public void dropDownLists() throws IOException {
        try (HSSFWorkbook workbook = new HSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data Validation");
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);
            DVConstraint dvConstraint = DVConstraint.createExplicitListConstraint(new String[]{"10", "20", "30"});
            DataValidation dataValidation = new HSSFDataValidation(addressList, dvConstraint);
            dataValidation.setSuppressDropDownArrow(false);
            sheet.addValidationData(dataValidation);

            HSSF hssf = new HSSF();
            hssf.setFullFileName("dropDownLists");
            hssf.generateExcel(workbook);
        }
    }


    /**
     * The following code will limit the value the user can enter into cell A1 to one of three integer values, 10, 20 or 30.
     *
     * @throws IOException
     */
    public void checkValue() throws IOException {
        try (Workbook workbook = new HSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data Validation");
            CellRangeAddressList addressList = new CellRangeAddressList(0, 0, 0, 0);

            DVConstraint dvConstraint = DVConstraint.createExplicitListConstraint(new String[]{"10", "20", "30"});

            DataValidation dataValidation = new HSSFDataValidation(addressList, dvConstraint);
            dataValidation.setSuppressDropDownArrow(true);
            sheet.addValidationData(dataValidation);

            HSSF hssf = new HSSF();
            hssf.setFullFileName("checkValue");
            hssf.generateExcel(workbook);
        }
    }


}
