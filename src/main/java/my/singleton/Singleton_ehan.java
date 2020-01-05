package my.singleton;

/**
 * 饿汉模式
 * 线程安全 -- 只加载一个
 * 性能 -- 高
 * 懒加载 -- 不支持
 */
// 禁止继承
final public class Singleton_ehan {

    // 实例变量
    private byte[] data = new byte[1024];
    /**
     * 定义变量直接初始化
     */
    private static Singleton_ehan instance = new Singleton_ehan();

    // 私有化构造函数 不能 new
    private Singleton_ehan() {

    }

    public static Singleton_ehan getInstance() {
        return instance;
    }
}
