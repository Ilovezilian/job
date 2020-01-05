package my.singleton;

/**
 * 线程安全 -- 安全
 * 性能 -- 高
 * 懒加载 -- 不支持
 */
// enum 本身是final 不支持继承
public enum Singleton_enum {
    INSTANCE;

    // 实例变量
    private byte[] data = new byte[1024];

    // 初始化会立即实例化
    Singleton_enum() {

    }

    public static void menthod() {
        // 调用该方法则会主动使用Singleton_enum，ISTANCE会被实例化
    }

    // 获取静态属性，获取的过程中顺带完成Holder的实例化
    public static Singleton_enum getInstance() {
        return INSTANCE;
    }
}
