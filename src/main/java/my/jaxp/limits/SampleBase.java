package my.jaxp.limits;/*
 * Copyright (c) 2013, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

import java.io.*;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.stream.events.XMLEvent;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stax.StAXSource;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 *  Base class 
 */
public class SampleBase {
    static final boolean DEBUG = true;
    public static boolean isWindows = false;
    static {
        if (System.getProperty("os.name").contains("Windows")) {
            isWindows = true;
        }
    };

        public static final String ORACLE_JAXP_PROPERTY_PREFIX =
        "http://www.oracle.com/xml/jaxp/properties/";

    public static final String JDK_ENTITY_EXPANSION_LIMIT = 
            ORACLE_JAXP_PROPERTY_PREFIX + "entityExpansionLimit"; 
    public static final String JDK_ELEMENT_ATTRIBUTE_LIMIT = 
            ORACLE_JAXP_PROPERTY_PREFIX + "elementAttributeLimit"; 
    public static final String JDK_MAX_OCCUR_LIMIT = 
            ORACLE_JAXP_PROPERTY_PREFIX + "maxOccurLimit"; 
    public static final String JDK_TOTAL_ENTITY_SIZE_LIMIT = 
            ORACLE_JAXP_PROPERTY_PREFIX + "totalEntitySizeLimit"; 
    public static final String JDK_GENERAL_ENTITY_SIZE_LIMIT = 
            ORACLE_JAXP_PROPERTY_PREFIX + "maxGeneralEntitySizeLimit"; 
    public static final String JDK_PARAMETER_ENTITY_SIZE_LIMIT = 
            ORACLE_JAXP_PROPERTY_PREFIX + "maxParameterEntitySizeLimit"; 
    public static final String JDK_XML_NAME_LIMIT = 
            ORACLE_JAXP_PROPERTY_PREFIX + "maxXMLNameLimit"; 
    public static final String JDK_MAX_ELEMENT_DEPTH = 
            ORACLE_JAXP_PROPERTY_PREFIX + "maxElementDepth"; 
    public static final String JDK_ENTITY_COUNT_INFO = 
            ORACLE_JAXP_PROPERTY_PREFIX + "getEntityCountInfo"; 

    //System properties
    public static final String SP_ENTITY_EXPANSION_LIMIT = "jdk.xml.entityExpansionLimit"; 
    public static final String SP_ELEMENT_ATTRIBUTE_LIMIT =  "jdk.xml.elementAttributeLimit"; 
    public static final String SP_MAX_OCCUR_LIMIT = "jdk.xml.maxOccurLimit"; 
    public static final String SP_TOTAL_ENTITY_SIZE_LIMIT = "jdk.xml.totalEntitySizeLimit";     
    public static final String SP_GENERAL_ENTITY_SIZE_LIMIT = "jdk.xml.maxGeneralEntitySizeLimit"; 
    public static final String SP_PARAMETER_ENTITY_SIZE_LIMIT = "jdk.xml.maxParameterEntitySizeLimit"; 
    public static final String SP_XML_NAME_LIMIT = "jdk.xml.maxXMLNameLimit"; 
    
    //legacy System Properties
    public final static String ENTITY_EXPANSION_LIMIT = "entityExpansionLimit";
    public static final String ELEMENT_ATTRIBUTE_LIMIT = "elementAttributeLimit" ;
    public final static String MAX_OCCUR_LIMIT = "maxOccurLimit";
    
    public static final String DISALLOW_DOCTYPE_DECL_FEATURE = "http://apache.org/xml/features/disallow-doctype-decl";
    public static final String LOAD_EXTERNAL_DTD_FEATURE = "http://apache.org/xml/features/nonvalidating/load-external-dtd";
    public static final String EXTERNAL_GENERAL_ENTITIES_FEATURE = "http://xml.org/sax/features/external-general-entities";
    public static final String EXTERNAL_PARAMETER_ENTITIES_FEATURE = "http://xml.org/sax/features/external-parameter-entities";
    static final String SCHEMA_LANGUAGE = "http://java.sun.com/xml/jaxp/properties/schemaLanguage";
    static final String SCHEMA_SOURCE = "http://java.sun.com/xml/jaxp/properties/schemaSource";

    public static final boolean SET_FSP_EXPLICITLY = true;
    public static final boolean SET_FSP_BEFORE = true;
    public static final boolean FSP_NOTSET = true;
    public static final boolean SECURE_PROCESSING_TRUE = true;
    public static final boolean SECURE_PROCESSING_FALSE = false;
    public static final boolean DISALLOWDTD_TRUE = true;
    public static final boolean DISALLOWDTD_FALSE = false;
    public static final boolean NOTLOADEXTERNALDTD_TRUE = true;
    public static final boolean NOTLOADEXTERNALDTD_FALSE = false;
    public static final boolean NOTINCGENENTITY_TRUE = true;
    public static final boolean NOTINCPARAMETERENTITY_TRUE = true;
    public static final boolean IGNORE_ERROR_TRUE = true;
    public static final boolean IGNORE_ERROR_FALSE = false;
    public static final String ACCESS_EXTERNAL_ALL = "all";
    static final String PROTOCOL_FILE = "file";
    static final String PROTOCOL_HTTP = "http";
    static String JAXPProperty_accessExternalDTD;
    static String JAXPProperty_accessExternalSchema;
    static String JAXPProperty_accessExternalStylesheet;
    static final int TEST_EXTERNALDTD = 1;
    static final int TEST_EXTERNALSCHEMA = 2;
    static final int TEST_EXTERNALSTYLESHEET = 3;


    String filePath;
    String testName;

    static String _errMsg;

    int passed = 0, failed = 0;

    public SampleBase(String name) {
        testName = name;
    }

    //junit @Override
    protected void setUp() {
        if (!isNewPropertySupported()) {
            System.exit(0);
        }

        /** JTREG */
        filePath = System.getProperty("test.src");
        if (filePath == null) {
            //current directory
            filePath = System.getProperty("user.dir");
        }
                 
        if (isWindows) {
            filePath = filePath.replace('\\', '/');
        }
    }

    //junit @Override
    protected void tearDown() {

        System.out.println("\nNumber of tests passed: " + passed);
        System.out.println("Number of tests failed: " + failed + "\n");

        if (_errMsg != null ) {
            throw new RuntimeException(_errMsg);
        }
    }



    StAXSource staxSourceFor(String _xmlFileId, String _xmlFile)
            throws XMLStreamException, FileNotFoundException {
        return new StAXSource(
                    XMLInputFactory.newFactory().createXMLEventReader(
                        _xmlFileId, new FileInputStream(_xmlFile)));
    }
    /**
     * helper method for creating validating SAX parser
     *
     * @param secure
     * @return
     * @throws Exception
     */
    protected SAXParser createValidatingParser(boolean secure) throws Exception {
        if (secure) {
            return getSAXParser(true, true, secure, false, false, true);
        } else {
            return getSAXParser(false, false, false, false, false, true);
        }
    }
    
    SAXParser getSAXParser()
            throws ParserConfigurationException, SAXException {
        return getSAXParser(false, false, false, false, false);
    }
    SAXParser getSAXParser(boolean setFSP, boolean setFSPBefore, boolean secure)
            throws ParserConfigurationException, SAXException {
        return getSAXParser(setFSP, setFSPBefore, secure, false, false);
    }
    
    SAXParser getSAXParser(boolean setFSP, boolean setFSPBefore, boolean secure, boolean disallowDTD,
            boolean notLoadExternalDTD)
            throws ParserConfigurationException, SAXException {
        return getSAXParser(setFSP, setFSPBefore, secure, disallowDTD,
            notLoadExternalDTD, false);
    }
    /**
     * Return a SAXParser
     * @param setFSP indicate if FSP is to be set explicitly
     * @param setFSPBefore indicate FSP is set before the properties
     * @param secure secure processing
     * @param disallowDTD set disallowDTD feature
     * @param notLoadExternalDTD set loadExternalDTD feature
     * @return
     * @throws ParserConfigurationException
     * @throws SAXException 
     */
    SAXParser getSAXParser(boolean setFSP, boolean setFSPBefore, boolean secure, boolean disallowDTD,
            boolean notLoadExternalDTD, boolean isValidating)
            throws ParserConfigurationException, SAXException {
        SAXParserFactory spf = SAXParserFactory.newInstance();
        if (setFSP && setFSPBefore) {
            spf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, secure);
        }
        if (disallowDTD) {
            spf.setFeature(DISALLOW_DOCTYPE_DECL_FEATURE, disallowDTD);
        }
        if (notLoadExternalDTD) {
            spf.setValidating(false);
            spf.setFeature(LOAD_EXTERNAL_DTD_FEATURE, false);
        }
        
        if (isValidating) {
            spf.setNamespaceAware(true);
            spf.setValidating(true);            
        }
        SAXParser parser = spf.newSAXParser();
        if (isValidating) {
            parser.setProperty(
                    "http://java.sun.com/xml/jaxp/properties/schemaLanguage",
                    "http://www.w3.org/2001/XMLSchema");
        }

        return parser;
    }

    
    public DocumentBuilder getDOMBuilder() {
        return getDOMBuilder(false, false, false, null, null);
    }    
    
    public DocumentBuilder getDOMBuilder(String property, String value) {
        return getDOMBuilder(false, false, false, property, value);
    }    
    
    public DocumentBuilder getDOMBuilder(boolean setFSP, boolean setFSPBefore, boolean secure) {
        return getDOMBuilder(setFSP, setFSPBefore, secure, null, null);
    }    
    /**
     * Return DocumentBuilder
     * @param setFSP indicate if FSP is to be set explicitly
     * @param setFSPBefore indicate FSP is set before the properties
     * @param secure secure processing
     * @param property property to be set
     * @param value value of the property
     * @return 
     */
    public DocumentBuilder getDOMBuilder(boolean setFSP, boolean setFSPBefore, 
            boolean secure, String property, String value) {
        return getDOMBuilder(setFSP, setFSPBefore, secure, property, value, false, false);
    }

    public DocumentBuilder getDOMBuilder(boolean setFSP, boolean setFSPBefore, 
            boolean secure, String property, String value,
            boolean disallowDTD, boolean notLoadExternalDTD) {
        return getDOMBuilder(setFSP, setFSPBefore, 
            secure, property, value,
            disallowDTD, notLoadExternalDTD, false);
    }
    
    public DocumentBuilder getDOMBuilder(boolean setFSP, boolean setFSPBefore, 
            boolean secure, String property, String value,
            boolean disallowDTD, boolean notLoadExternalDTD,
            boolean isValidating) {
        DocumentBuilderFactory dbf = null;
        DocumentBuilder docBuilder = null;
        try {
            dbf = DocumentBuilderFactory.newInstance();
            if (setFSP && setFSPBefore) {
                dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, secure);
            }
            if (property != null) {
                dbf.setAttribute(property, value);
            }
            
            if (disallowDTD) {
                dbf.setFeature(DISALLOW_DOCTYPE_DECL_FEATURE, true);
            }
            if (notLoadExternalDTD) {
                dbf.setFeature(LOAD_EXTERNAL_DTD_FEATURE, false);
            }

            if (isValidating) {
                dbf.setNamespaceAware(true);
                dbf.setValidating(true);
                dbf.setAttribute(SCHEMA_LANGUAGE, XMLConstants.W3C_XML_SCHEMA_NS_URI);
                dbf.setFeature("http://apache.org/xml/features/validation/schema", true);                
            }
            docBuilder = dbf.newDocumentBuilder();
        } catch (Exception e) {
            success("New property not supported; Test not run!");
        }
        return docBuilder;
    }    

    /**
     * Create validating DOM builder
     *
     * @param secure
     * @return
     * @throws Exception
     */
    protected DocumentBuilder createValidatingDOM(boolean secure, String property, String value) throws Exception {
        if (secure) {
            return getDOMBuilder(true, true, 
                true, property, value,
                false, false,
                true);
        } else {
            return getDOMBuilder(false, false, 
                false, property, value,
                false, false,
                true);
        }
    }

    /**
     * Check if the new properties are supported
     *
     * @return true if yes, false if not
     */
    public boolean isNewPropertySupported() {
        try {
            SAXParser parser = getSAXParser(false, false, false);
            parser.setProperty(JDK_GENERAL_ENTITY_SIZE_LIMIT, "10000");
        } catch (ParserConfigurationException ex) {
            fail(ex.getMessage());
        } catch (SAXException ex) {
            String err = ex.getMessage();
            if (err.contains("Property '" + JDK_GENERAL_ENTITY_SIZE_LIMIT + "' is not recognized.")) {
                //expected before this patch
                debugPrint("New limit properties not supported. Samples not run.");
                return false;
            }
        }
        return true;
    }
    
    void unexpectedException(String testName, Exception e, String typeOfLimit) {
        String err = e.getMessage();
        if (err == null) err = String.valueOf(e);

        fail(testName + " Failed: " + err);
    }
    
    void expectedException(String testName, Exception e, String typeOfLimit) {
        String err = e.getMessage();
        if (err == null) err = String.valueOf(e);
        if (err.contains("The parser has encountered more than") && err.contains("entity expansions")) {
            debugPrint("entity expansion limit reached");
        } else if (err.contains("The entity") && err.contains("was referenced, but not declared")) {
            debugPrint("Undeclared entity is caught; Or SupportDTD=false for StAX");
        } else if (err.contains("JAXP0001")) {
            debugPrint(err);
        } else if (err.contains("http://apache.org/xml/features/disallow-doctype-decl")) {
            //expected error
            debugPrint(DISALLOW_DOCTYPE_DECL_FEATURE + " is set");
        } else {
            fail(testName + " Failed: " + err);
        }
        success(testName + ": " + typeOfLimit + " test passed");
    }
    
    void fail(String errMsg) {
        if (_errMsg == null) {
            _errMsg = errMsg;
        } else {
            _errMsg = _errMsg + "\n" + errMsg;
        }
        failed++;
    }

    void success(String msg) {
        passed++;
        System.out.println(msg);
    }

    void readDTD(XMLStreamReader xsr) throws XMLStreamException {
        while (xsr.hasNext()) {
            int e = xsr.next();
            if (e == XMLEvent.DTD) {
                debugPrint("DTD: " + xsr.getText());
            }
        }

    }

    void readEvent(XMLEventReader er) throws XMLStreamException {
        XMLEvent evt = er.nextEvent();  //StartDocument
        while (evt.getEventType() != XMLStreamConstants.END_DOCUMENT) {
            if (evt.getEventType() == XMLStreamConstants.DTD) {
                debugPrint("DTD: " + evt.toString());
            }
            evt = er.nextEvent();
        }
    }
    

    DOMSource getDOMSource(String uri, String systemId) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        Document doc = dbf.newDocumentBuilder().parse(new File(uri));
        DOMSource ds = new DOMSource(doc);
        ds.setSystemId(systemId);
        return ds;
    }

    /**
     * Flag indicating if properties from java.home/lib/jaxp.properties have
     * been cached.
     */
    static volatile boolean firstTime = true;

    static void debugPrint(String msg) {
        if (DEBUG) {
            System.out.println(msg);
        }
    }
}
