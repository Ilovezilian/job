package my.jaxp.xslt;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.IOException;

public class MyTransformationTest {
    public static void main(String[] args) throws ParserConfigurationException, IOException, SAXException, TransformerException {
        readXmlFromFile();
        writeXmlFile();
    }

    private static void writeXmlFile() throws ParserConfigurationException, TransformerException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder documentBuilder = factory.newDocumentBuilder();
        Document document = documentBuilder.newDocument();
        GenerateDocumentElement(document);
        Source source = new DOMSource(document);

        Result result = new StreamResult(new File("src/main/java/my/jaxp/xslt/data/my.xml"));

        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.transform(source, result);

    }

    private static void GenerateDocumentElement(Document document) {
        document.setXmlVersion("1.0");
        Element title = document.createElement("TITLE");
        title.setTextContent("A Sample Article");

        Element para = document.createElement("PARA");
        para.setTextContent("This section will introduce a subsection.");

        Element para1 = document.createElement("PARA");
        para1.setTextContent("This is the text of the subsection.");

        Element sect1 = document.createElement("SECT");
        sect1.setTextContent("The Subsection Heading");
        sect1.appendChild(para1);

        Element sect = document.createElement("SECT");
        sect.setTextContent("The First Major Section");
        sect.appendChild(para);
        sect.appendChild(sect1);

        Element article = document.createElement("ARTICLE");
        article.appendChild(title);
        article.appendChild(sect);

        document.appendChild(article);
    }

    private static void readXmlFromFile() throws ParserConfigurationException, SAXException, IOException, TransformerException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder documentBuilder = factory.newDocumentBuilder();

//        File file = new File("D:\\git\\job\\src\\main\\java\\my\\jaxp\\xslt\\data\\sample.xml");
        File file = new File("D:/git/job/src/main/java/my/jaxp/xslt/data/sample.xml");
//        File file = new File("src/main/java/my/jaxp/xslt/data/sample.xml");
        Document document = documentBuilder.parse(file);

        TransformerFactory transformerFactory = TransformerFactory.newInstance();

        DOMSource source = new DOMSource(document);

        Result result = new StreamResult(System.out);
        Transformer transformer = transformerFactory.newTransformer();
        transformer.transform(source, result);
    }
}
