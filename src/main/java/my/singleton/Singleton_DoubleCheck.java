package my.singleton;

import java.net.Socket;
import java.sql.Connection;

/**
 * 线程安全 -- 不安全
 * 性能 -- 高
 * 懒加载 -- 支持
 */
// 禁止继承
final public class Singleton_DoubleCheck {

    // 实例变量
    private byte[] data = new byte[1024];
    private static Singleton_DoubleCheck instance;

    Connection connection;
    Socket socket;

    // 私有化构造函数 不能 new
    private Singleton_DoubleCheck() {
        connection = null; // 初始化
        socket = null;     // 初始化
        /**
         * connection,socket,instance 的实例化是可以被JVM指令重排，
         * 所以可能会导致connection,socket空指针异常
         */
    }

    public static Singleton_DoubleCheck getInstance() {
        // 懒加载，多线程有初始化问题
        if (null == instance) {
            synchronized (Singleton_DoubleCheck.class) {
                if (null == instance) {
                    instance = new Singleton_DoubleCheck();
                }
            }
        }

        return instance;
    }
}
