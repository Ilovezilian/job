package my.poi;

public class GenerateExcelFileFactory {
    public AbstractGenerateExcelFile newExcelFileWithSXSSF() {
        return newExcelFileWithXSSF("callDaddy.xlsx", 1, 10, 10);
    }

    public AbstractGenerateExcelFile newExcelFileWithHSSF(String fileName, int sheetNum, int rowNum, int column) {
        return newExcelFile(new HSSF(), fileName, sheetNum, rowNum, column);
    }


    public AbstractGenerateExcelFile newExcelFileWithXSSF(String fileName, int sheetNum, int rowNum, int column) {
        return newExcelFile(new XSSF(), fileName, sheetNum, rowNum, column);
    }

    public AbstractGenerateExcelFile newExcelFileWithSXSSF(String fileName, int sheetNum, int rowNum, int column) {
        return newExcelFile(new SXSSF(), fileName, sheetNum, rowNum, column);
    }

    private AbstractGenerateExcelFile newExcelFile(AbstractGenerateExcelFile file, String fileName, int sheetNum, int rowNum, int column) {
//        file.setFullFileName(fileName);
//        file.setSheetNum(sheetNum);
//        file.setRowNum(rowNum);
//        file.setColumnNum(column);
        // 用下面这个来替换上面这个方式 这样的话连工厂方法都不需要了。
        AbstractGenerateExcelFile.builder()
                .fullFileName(fileName)
                .sheetNum(sheetNum)
                .rowNum(rowNum)
                .columnNum(column)
                .build();
        return file;
    }
}
