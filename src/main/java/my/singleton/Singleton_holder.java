package my.singleton;

/**
 * 线程安全 -- 安全
 * 性能 -- 高
 * 懒加载 -- 支持
 */
// 禁止继承
final public class Singleton_holder {

    // 实例变量
    private byte[] data = new byte[1024];

    // 私有化构造函数 不能 new
    private Singleton_holder() {

    }

    // 在内部类中持有Singleton的实例可以直接被初始化
    private static class Holder {
        private static Singleton_holder instance = new Singleton_holder();
    }

    // 获取静态属性，获取的过程中顺带完成Holder的实例化
    public static Singleton_holder getInstance() {
        return Holder.instance;
    }
}
