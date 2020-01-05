package my.singleton;

import java.net.Socket;
import java.sql.Connection;

/**
 * 线程安全 -- 安全
 * 性能 -- 高
 * 懒加载 -- 支持
 */
// 禁止继承
final public class Singleton_volatile_DoubleCheck {

    // 实例变量
    private byte[] data = new byte[1024];
    /**
     * volatile 可以支持 实例化 connection,socket,instance 的实例化是不被JVM指令重排，
     */
    private static volatile Singleton_volatile_DoubleCheck instance;

    Connection connection;
    Socket socket;

    // 私有化构造函数 不能 new
    private Singleton_volatile_DoubleCheck() {
        connection = null; // 初始化
        socket = null;     // 初始化
    }

    public static Singleton_volatile_DoubleCheck getInstance() {
        // 懒加载，多线程有初始化问题
        if (null == instance) {
            synchronized (Singleton_volatile_DoubleCheck.class) {
                if (null == instance) {
                    instance = new Singleton_volatile_DoubleCheck();
                }
            }
        }

        return instance;
    }
}
