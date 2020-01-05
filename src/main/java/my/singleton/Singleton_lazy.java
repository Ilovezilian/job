package my.singleton;

/**
 * 懒汉模式
 * 线程安全 -- 不安全
 * 性能 -- 高
 * 懒加载 -- 支持
 */
// 禁止继承
final public class Singleton_lazy {

    // 实例变量
    private byte[] data = new byte[1024];
    private static Singleton_lazy instance;

    // 私有化构造函数 不能 new
    private Singleton_lazy() {

    }

    public static Singleton_lazy getInstance() {
        /**
         * 懒加载，多线程有初始化问题
         */
        if (null == instance) {
            instance = new Singleton_lazy();
        }

        return instance;
    }
}
