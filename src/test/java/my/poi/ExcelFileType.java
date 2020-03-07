package my.poi;

public enum ExcelFileType {
    xssf(".xlsx", "XSSF"),
    sxssf(".xlsx", "SXSSF"),
    hssf(".xls", "HSSF");

    String fileTypeSuffix;
    String className;

    ExcelFileType(String fileTypeSuffix, String className) {
        this.className = className;
        this.fileTypeSuffix = fileTypeSuffix;
    }
}
