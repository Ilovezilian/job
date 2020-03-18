package my.file;


public enum ByteUnitEnum {

    bit((byte) -1, "bit", "bit 比特"),
    B((byte) 0, "B", "byte 字节"),
    KB((byte) 1, "K", "Kilobyte 千字节"),
    MB((byte) 2, "M", "Megabyte 兆字节 简称“兆”"),
    GB((byte) 3, "G", "Gigabyte 吉字节 又称“千兆”"),
    TB((byte) 4, "T", "Trillionbyte 万亿字节 太字节"),
    PB((byte) 5, "P", "Petabyte 千万亿字节 拍字节"),
    EB((byte) 6, "E", "Exabyte 百亿亿字节 艾字节"),
    ZB((byte) 7, "Z", "Zettabyte 十万亿亿字节 泽字节"),
    YB((byte) 8, "Y", "Jottabyte 一亿亿亿字节 尧字节"),
    BB((byte) 9, "B", "Brontobyte 一千亿亿亿字节"),
    ;
    private byte order;
    private String name;
    private String alias;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    ByteUnitEnum(byte order, String name, String alias) {
        this.order = order;
        this.name = name;
        this.alias = alias;
    }

    public static String getHumanSpace(long size, ByteUnitEnum unitEnum) {
        final int seg = 1024;
        while (size > seg && BB != unitEnum) {
            size /= seg;
            unitEnum = getEnumByOrder((byte) (unitEnum.getOrder() + 1));
        }

        return size + unitEnum.name;
    }

    public byte getOrder() {
        return order;
    }

    public void setOrder(byte order) {
        this.order = order;
    }

    public static ByteUnitEnum getEnumByOrder(byte order) {
        for (ByteUnitEnum value : ByteUnitEnum.values()) {
            if (order == value.getOrder()) {
                return value;
            }
        }

        return B;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
