package my.singleton;

/**
 * 线程安全 -- 安全
 * 性能 -- 高
 * 懒加载 -- 支持
 */
// enum 本身是final 不支持继承
final public class Singleton_enumPlus {

    // 实例变量
    private byte[] data = new byte[1024];

    private Singleton_enumPlus() {

    }

    private enum EnumHolder {
        INSTANCE;
        private Singleton_enumPlus instance;

        EnumHolder() {
            instance = new Singleton_enumPlus();
        }

        private Singleton_enumPlus getSingleton_enumPlus() {
            return instance;
        }
    }

    // 获取静态属性，获取的过程中顺带完成Holder的实例化
    public static Singleton_enumPlus getInstance() {
        return EnumHolder.INSTANCE.getSingleton_enumPlus();
    }
}
