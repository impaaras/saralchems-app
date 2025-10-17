import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Share,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {moderateScale} from '../../utils/Responsive/responsive';
import {toWords} from 'number-to-words';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const InvoiceModal = ({visible, invoiceData, onClose}) => {
  const viewShotRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const invoice = invoiceData;

  const formatCurrency = amount => {
    return `₹${amount?.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = dateString => {
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const formatCurrencyWithoutSymbol = amount => {
    return amount?.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const generateHTMLForPDF = () => {
    return `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    font-size: 11px;
                    line-height: 1.3;
                    color: #000;
                    padding: 10px;
                    background-color: #f5f5f5;
                }
                
                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border: 2px solid #000;
                }
                
                /* Header Section */
                .header-row {
                    display: flex;
                    border-bottom: 1px solid #000;
                    min-height: 30px;
                }
                
                .gstin-cell {
                    flex: 1;
                    padding: 8px;
                    border-right: 1px solid #000;
                    font-weight: bold;
                }
                
                .original-copy-cell {
                    width: 150px;
                    padding: 8px;
                    text-align: center;
                    font-weight: bold;
                }
                
                /* Invoice Type */
                .invoice-type-section {
                    text-align: center;
                    font-size: 16px;
                    font-weight: bold;
                    padding: 8px;
                    border-bottom: 1px solid #000;
                }
                
                /* Company Header */
                .company-section {
                    text-align: center;
                    padding: 15px;
                    border-bottom: 1px solid #000;
                }
                
                .company-name {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .company-address {
                    font-size: 11px;
                    margin-bottom: 2px;
                }
                
                /* Main Details Section */
                .main-details {
                    display: flex;
                    border-bottom: 1px solid #000;
                }
                
                .party-section {
                    flex: 1;
                    padding: 8px;
                    border-right: 1px solid #000;
                }
                
                .invoice-section {
                    width: 300px;
                    padding: 8px;
                }
                
                .detail-line {
                    margin-bottom: 3px;
                    display: flex;
                }
                
                .detail-label {
                    width: 100px;
                    font-weight: normal;
                }
                
                .detail-colon {
                    width: 15px;
                }
                
                .detail-value {
                    flex: 1;
                    font-weight: bold;
                }
                
                .party-name {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .party-address {
                    margin-bottom: 10px;
                }
                
                /* IRN Section */
                .irn-section {
                    padding: 8px 12px;
                    border-bottom: 1px solid #000;
                    font-size: 10px;
                }
                
                .irn-line {
                    display: flex;
                    margin-bottom: 3px;
                }
                
                .irn-label {
                    width: 60px;
                }
                
                .irn-colon {
                    width: 15px;
                }
                
                .irn-value {
                    flex: 1;
                }
                
                /* Items Table */
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .items-table th {
                    border: 1px solid #000;
                    padding: 6px 4px;
                    text-align: center;
                    font-size: 9px;
                    font-weight: bold;
                    background-color: #f8f8f8;
                }
                
                .items-table td {
                    border: 1px solid #000;
                    padding: 6px 4px;
                    font-size: 9px;
                    text-align: center;
                }
                
                .sn-col { width: 6%; }
                .desc-col { width: 20%; text-align: left !important; }
                .hsn-col { width: 12%; }
                .qty-col { width: 8%; text-align: right !important; }
                .unit-col { width: 8%; }
                .price-col { width: 10%; text-align: right !important; }
                .discount-col { width: 8%; }
                .igst-rate-col { width: 8%; }
                .igst-amt-col { width: 10%; text-align: right !important; }
                .amount-col { width: 10%; text-align: right !important; }
                
                /* Summary Rows */
                .summary-section {
                    border-bottom: 1px solid #000;
                }
                
                .summary-row {
                    display: flex;
                    padding: 5px 12px;
                    justify-content: flex-end;
                    align-items: center;
                }
                
                .summary-label {
                    margin-right: 20px;
                }
                
                .summary-value {
                    width: 100px;
                    text-align: right;
                    font-weight: bold;
                }
                
                .grand-total-section {
                    display: flex;
                    padding: 8px 12px;
                    border-bottom: 1px solid #000;
                    align-items: center;
                }
                
                .grand-total-left {
                    flex: 1;
                    font-weight: bold;
                }
                
                .grand-total-right {
                    width: 100px;
                    text-align: right;
                    font-weight: bold;
                    border: 1px solid #000;
                    padding: 5px;
                }
                
                /* Tax Table */
                .tax-table {
                    width: 60%;
                    border-collapse: collapse;
                    margin: 10px 0;
                }
                
                .tax-table th,
                .tax-table td {
                    border: 1px solid #000;
                    padding: 5px;
                    text-align: center;
                    font-size: 10px;
                }
                
                .tax-table th {
                    font-weight: bold;
                    background-color: #f8f8f8;
                }
                
                .tax-table .number-cell {
                    text-align: right;
                }
                
                /* Amount in Words */
                .amount-words {
                    padding: 10px 12px;
                    border-bottom: 1px solid #000;
                    font-weight: bold;
                }
                
                /* Declaration */
                .declaration-section {
                    text-align: center;
                    padding: 8px;
                    border-bottom: 1px solid #000;
                }
                
                .declaration-title {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                
                /* Bank Details */
                .bank-section {
                    padding: 8px 12px;
                    border-bottom: 1px solid #000;
                }
                
                .bank-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                /* Footer Section */
                .footer-section {
                    display: flex;
                    min-height: 200px;
                }
                
                .terms-column {
                    flex: 1;
                    padding: 12px;
                    border-right: 1px solid #000;
                }
                
                .qr-column {
                    width: 200px;
                    padding: 12px;
                    text-align: center;
                    border-right: 1px solid #000;
                }
                
                .signature-column {
                    width: 200px;
                    padding: 12px;
                    text-align: center;
                }
                
                .terms-title {
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                
                .terms-list {
                    font-size: 10px;
                }
                
                .terms-list div {
                    margin-bottom: 3px;
                }
                
                .qr-placeholder {
                    width: 100px;
                    height: 100px;
                    border: 1px solid #000;
                    margin: 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                }
                
                .signature-line {
                    margin-top: 80px;
                    border-top: 1px solid #000;
                    padding-top: 5px;
                    font-weight: bold;
                }
                
                /* Responsive Design */
                @media screen and (max-width: 768px) {
                    body {
                        padding: 5px;
                        font-size: 10px;
                    }
                    
                    .main-details {
                        flex-direction: column;
                    }
                    
                    .party-section {
                        border-right: none;
                        border-bottom: 1px solid #000;
                    }
                    
                    .invoice-section {
                        width: 100%;
                        border-bottom: none;
                    }
                    
                    .items-table th,
                    .items-table td {
                        padding: 3px 2px;
                        font-size: 8px;
                    }
                    
                    .footer-section {
                        flex-direction: column;
                    }
                    
                    .terms-column,
                    .qr-column,
                    .signature-column {
                        border-right: none;
                        border-bottom: 1px solid #000;
                        width: 100%;
                    }
                    
                    .signature-column {
                        border-bottom: none;
                    }
                    
                    .tax-table {
                        width: 100%;
                    }
                }
                
                @media screen and (max-width: 480px) {
                    .header-row {
                        flex-direction: column;
                    }
                    
                    .gstin-cell {
                        border-right: none;
                        border-bottom: 1px solid #000;
                    }
                    
                    .original-copy-cell {
                        width: 100%;
                    }
                    
                    .items-table {
                        font-size: 7px;
                    }
                    
                    .items-table th,
                    .items-table td {
                        padding: 2px 1px;
                    }
                }
                
                @media print {
                    body {
                        padding: 0;
                        background: white;
                    }
                    
                    .invoice-container {
                        margin: 0;
                        max-width: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <!-- Header Row -->
                <div class="header-row">
                    <div class="gstin-cell">GSTIN : 07AESPG4279D2Z9</div>
                    <div class="original-copy-cell">Original Copy</div>
                </div>
                
                <!-- Invoice Type -->
                <div class="invoice-type-section">TAX INVOICE</div>
                
                <!-- Company Header -->
                <div class="company-section">
                    <div class="company-name">SARAL CHEMICALS</div>
                    <div class="company-address">A-262/2, PHASE-1</div>
                    <div class="company-address">ASHOK VIHAR, DELHI 110052</div>
                    <div class="company-address">email : saraldyes@gmail.com</div>
                    <div class="company-address">Mob.- +91 9810024522, 9810166261, Tel : 41501969, 23913616</div>
                </div>
                
                <!-- Main Details Section -->
                <div class="main-details">
                    <div class="party-section">
                        <div style="font-weight: bold; margin-bottom: 8px;">Party Details :</div>
                        <div class="party-name">JUMBO INTERNATIONAL</div>
                        <div class="party-address">SHED 2 D, PHASE VI, SECTOR 37, Gurugram<br>Haryana, 122001</div>
                        
                        <div class="detail-line">
                            <div class="detail-label">GSTIN / UIN</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value">06ANLPA5517C1ZH</div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">P.O. No.</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value"></div>
                        </div>
                    </div>
                    
                    <div class="invoice-section">
                        <div class="detail-line">
                            <div class="detail-label">Invoice No.</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value">SC/24-25/002146</div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">Dated</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value">31-03-2025</div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">Place of Supply</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value">Haryana (06)</div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">Reverse Charge</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value">N</div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">GR/RR No.</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value"></div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">Transport</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value">-</div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">Vehicle No.</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value"></div>
                        </div>
                        <div class="detail-line">
                            <div class="detail-label">E-Way Bill No.</div>
                            <div class="detail-colon">:</div>
                            <div class="detail-value"></div>
                        </div>
                    </div>
                </div>
                
                <!-- IRN Section -->
                <div class="irn-section">
                    <div class="irn-line">
                        <div class="irn-label">IRN</div>
                        <div class="irn-colon">:</div>
                        <div class="irn-value">2b0e165d6d15960760546274f38a25af2cb32912a87e645c76ce59077948d8bf</div>
                        <div style="margin-left: 40px;">Ack.No.</div>
                        <div class="irn-colon">:</div>
                        <div style="width: 120px;">172517158175532</div>
                        <div style="margin-left: 20px;">Ack. Date</div>
                        <div class="irn-colon">:</div>
                        <div style="width: 80px;">31-03-2025</div>
                    </div>
                </div>
                
                <!-- Items Table -->
                <table class="items-table">
                    <thead>
                        <tr>
                            <th class="sn-col">S.N.</th>
                            <th class="desc-col">Description of Goods</th>
                            <th class="hsn-col">HSN/SAC Code</th>
                            <th class="qty-col">Qty.</th>
                            <th class="unit-col">Unit</th>
                            <th class="price-col">List Price</th>
                            <th class="discount-col">Discount</th>
                            <th class="igst-rate-col">IGST Rate</th>
                            <th class="igst-amt-col">IGST Amount</th>
                            <th class="amount-col">Amount(Rs.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1.</td>
                            <td class="desc-col">EZYCOAT- 828</td>
                            <td>350699</td>
                            <td class="qty-col">10.000</td>
                            <td>LTR</td>
                            <td class="price-col">193.00</td>
                            <td>0.00 %</td>
                            <td>18.00 %</td>
                            <td class="igst-amt-col">347.40</td>
                            <td class="amount-col">2,277.40</td>
                        </tr>
                        <tr>
                            <td>2.</td>
                            <td class="desc-col">IMAGE MATE-DZ-343</td>
                            <td>37079090</td>
                            <td class="qty-col">10.000</td>
                            <td>LTR</td>
                            <td class="price-col">730.00</td>
                            <td>0.00 %</td>
                            <td>18.00 %</td>
                            <td class="igst-amt-col">1,314.00</td>
                            <td class="amount-col">8,614.00</td>
                        </tr>
                        <tr>
                            <td>3.</td>
                            <td class="desc-col">GREY CLOTH<br>Mono 100X68" 14 No</td>
                            <td>54071029</td>
                            <td class="qty-col">142.500</td>
                            <td>Metre</td>
                            <td class="price-col">51.00</td>
                            <td>0.00 %</td>
                            <td>5.00 %</td>
                            <td class="igst-amt-col">363.38</td>
                            <td class="amount-col">7,630.88</td>
                        </tr>
                        <tr>
                            <td>4.</td>
                            <td class="desc-col">CARTAGE 18%</td>
                            <td>9965</td>
                            <td class="qty-col">---</td>
                            <td>---</td>
                            <td class="price-col"></td>
                            <td>0.00 %</td>
                            <td>18.00 %</td>
                            <td class="igst-amt-col">45.00</td>
                            <td class="amount-col">295.00</td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Summary Section -->
                <div class="summary-section">
                    <div class="summary-row">
                        <div class="summary-label"></div>
                        <div class="summary-value">18,817.28</div>
                    </div>
                    <div class="summary-row">
                        <div class="summary-label">Less : Rounded off (-)</div>
                        <div class="summary-value">0.28</div>
                    </div>
                </div>
                
                <!-- Grand Total -->
                <div class="grand-total-section">
                    <div class="grand-total-left">Grand Total &nbsp;&nbsp;&nbsp; 162.500 Units</div>
                    <div class="grand-total-right">18,817.00</div>
                </div>
                
                <!-- Tax Table -->
                <table class="tax-table">
                    <thead>
                        <tr>
                            <th>Tax Rate</th>
                            <th>Taxable Amt.</th>
                            <th>IGST Amt.</th>
                            <th>Total Tax</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>18%</td>
                            <td class="number-cell">9,480.00</td>
                            <td class="number-cell">1,706.40</td>
                            <td class="number-cell">1,706.40</td>
                        </tr>
                        <tr>
                            <td>5%</td>
                            <td class="number-cell">7,267.50</td>
                            <td class="number-cell">363.38</td>
                            <td class="number-cell">363.38</td>
                        </tr>
                        <tr style="font-weight: bold;">
                            <td>Total</td>
                            <td class="number-cell">16,747.50</td>
                            <td class="number-cell">2,069.78</td>
                            <td class="number-cell">2,069.78</td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Amount in Words -->
                <div class="amount-words">
                    Rupees Eighteen Thousand Eight Hundred Seventeen Only
                </div>
                
                <!-- Declaration -->
                <div class="declaration-section">
                    <div class="declaration-title">Declaration</div>
                    <div>MSME NO. UDYAM-DL-03-0015844</div>
                </div>
                
                <!-- Bank Details -->
                <div class="bank-section">
                    <div class="bank-title">Bank Details :</div>
                    <div>HDFC BANK A/C NO. 50200027518030</div>
                    <div>IFSC CODE: HDFC0000158</div>
                </div>
                
                <!-- Footer Section -->
                <div class="footer-section">
                    <div class="terms-column">
                        <div class="terms-title">Terms & Conditionsssss</div>
                        <div class="terms-list">
                            <div>E.& O.E.</div>
                            <div>1. Goods once sold will not be taken back.</div>
                            <div>2. Interest @ 18% p.a. will be charged if the payment</div>
                            <div>is not made within the 45 days.</div>
                            <div>3. Subject to 'Delhi' Jurisdiction only.</div>
                        </div>
                    </div>
                    
                    <div class="qr-column">
                        <div style="font-weight: bold; margin-bottom: 10px;">E-Invoice QR Code</div>
                        <div class="qr-placeholder">QR CODE</div>
                        <div style="margin-top: 20px;">Receiver's Signature :</div>
                    </div>
                    
                    <div class="signature-column">
                        <div style="margin-top: 60px; margin-bottom: 20px;">for SARAL CHEMICALS</div>
                        <div class="signature-line">Authorised Signatory</div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const htmlContent = generateHTMLForPDF();
      const fileName = `Invoice_${invoice?.invoiceNumber.replace(
        /\//g,
        '_',
      )}.pdf`;

      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Download',
        base64: true,
        width: 612,
        height: 792,
        padding: 0,
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      Alert.alert(
        'Success',
        `PDF generated successfully and saved to Downloads folder as ${fileName}`,
        [
          {
            text: 'OK',
            onPress: () => setIsGeneratingPDF(false),
          },
          {
            text: 'Share',
            onPress: async () => {
              try {
                await Share.share({
                  url: `file://${pdf.filePath}`,
                  title: `Invoice ${invoice?.invoiceNumber}`,
                  message: `Invoice ${invoice?.invoiceNumber} from Saral Chemicals`,
                });
              } catch (error) {
                console.error('Error sharing PDF:', error);
              }
              setIsGeneratingPDF(false);
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const fileName = `Invoice_${invoice?.invoiceNumber.replace(
        '/',
        '_',
      )}.jpg`;
      const destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      await RNFS.copyFile(uri, destPath);

      Alert.alert(
        'Success',
        `Invoice downloaded successfully to Downloads folder as ${fileName}`,
        [{text: 'OK'}],
      );
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert('Error', 'Failed to download invoice. Please try again.');
    }
  };

  const shareInvoice = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.share({
        url: uri,
        title: `Invoice ${invoice?.invoiceNumber}`,
        message: `Invoice ${invoice?.invoiceNumber} from Saral Chemicals`,
      });
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert('Error', 'Failed to share invoice. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Invoice Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Invoice Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}}>
              <View style={styles.invoiceContainer}>
                {/* GSTIN and Original Copy Header */}
                <View style={styles.gstinHeader}>
                  <Text style={styles.gstinText}>GSTIN : 07AESPG4279D2Z9</Text>
                  <Text style={styles.originalCopyText}>Original Copy</Text>
                </View>

                {/* Tax Invoice Header */}
                <View style={styles.taxInvoiceHeader}>
                  <Text style={styles.taxInvoiceText}>TAX INVOICE</Text>
                </View>

                {/* Company Header */}
                <View style={styles.companyHeader}>
                  <Text style={styles.companyName}>SARAL CHEMICALS</Text>
                  <Text style={styles.companyAddress}>A-262/2, PHASE-1</Text>
                  <Text style={styles.companyAddress}>
                    ASHOK VIHAR, DELHI 110052
                  </Text>
                  <Text style={styles.companyContact}>
                    email : saraldyes@gmail.com
                  </Text>
                  <Text style={[styles.companyContact, {fontWeight: 'bold'}]}>
                    Mob.- +91 9810024522, 9810166261, Tel : 41501969, 23913616
                  </Text>
                </View>

                {/* Party and Invoice Details */}
                <View style={styles.detailsSection}>
                  <View style={styles.leftColumn}>
                    <Text style={styles.sectionTitle}>Party Details :</Text>
                    <Text style={styles.partyName}>{invoice?.partyName}</Text>
                    <Text style={styles.partyAddress}>
                      {invoice?.partyAddress}
                    </Text>
                    <View style={[styles.detailRow, {marginTop: hp(1)}]}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>Transport</Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}>
                        {invoice?.transport}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>GSTIN / UIN </Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}>
                        {invoice?.gstinBuyer}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>P.O. No. </Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}></Text>
                    </View>
                  </View>

                  <View style={styles.rightColumn}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>Invoice No</Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}>
                        {invoice?.invoiceNumber}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>Dated</Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}>
                        {formatDate(invoice?.date)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>
                          Place of Supply
                        </Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}>Haryana (06)</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>
                          Reverse Charge
                        </Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}>N</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>GR/RR No.</Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}></Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>Vehicle No.</Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}></Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabelContainer}>
                        <Text style={styles.detailLabelText}>
                          E-Way Bill No.
                        </Text>
                        <Text style={styles.detailColon}>:</Text>
                      </View>
                      <Text style={styles.detailValue}></Text>
                    </View>
                  </View>
                </View>

                {/* IRN Details */}
                <View style={styles.irnInfoContainer}>
                  <View style={styles.irnInfoBlock}>
                    <Text style={styles.irnInfoLabel}>IRN:</Text>
                    <Text style={styles.irnInfoValue}>{invoice?.irn}</Text>
                  </View>
                  <View style={styles.ack}>
                    <View style={styles.irnInfoBlock}>
                      <Text style={styles.irnInfoLabel}>Ack. No.:</Text>
                      <Text style={styles.irnInfoValue}>{invoice?.ackNo}</Text>
                    </View>
                    <View style={styles.irnInfoBlock}>
                      <Text style={styles.irnInfoLabel}>Ack. Date:</Text>
                      <Text style={styles.irnInfoValue}>
                        {formatDate(invoice?.ackDate)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Items Table */}
                <View style={styles.tableContainer}>
                  <View
                    style={[
                      styles.tableHeader,
                      {borderBottomColor: '#001', borderBottomWidth: 1},
                    ]}>
                    <Text style={[styles.tableHeaderText, {flex: 0.4}]}>
                      S.N.
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 2}]}>
                      Description of Goods
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 0.8}]}>
                      HSN/SAC Code
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 0.6}]}>
                      Qty.
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 0.5}]}>
                      Unit
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 0.7}]}>
                      List Price
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 0.7}]}>
                      Discount
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 0.6}]}>
                      IGST Rate
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 0.8}]}>
                      IGST Amount
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 1.46}]}>
                      Amount(Rs.)
                    </Text>
                  </View>

                  {invoice?.items.map((item, index) => (
                    <View key={index} style={[styles.tableRow]}>
                      <Text style={[styles.tableCell, {flex: 0.4}]}>
                        {index + 1}.
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          {flex: 2, textAlign: 'left'},
                        ]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.tableCell, {flex: 0.8}]}>
                        {item.hsn}
                      </Text>
                      <Text style={[styles.tableCell, {flex: 0.6}]}>
                        {item.quantity === 0 ? '--' : item?.quantity.toFixed(3)}
                      </Text>
                      <Text style={[styles.tableCell, {flex: 0.5}]}>
                        {item.unit}
                      </Text>
                      <Text style={[styles.tableCell, {flex: 0.7}]}>
                        {item?.unitPrice}
                        {/* {item?.unitPrice === 0
                          ? '--'
                          : formatCurrencyWithoutSymbol(item?.unitPrice)} */}
                      </Text>
                      <Text style={[styles.tableCell, {flex: 0.7}]}>
                        {item.discount.toFixed(2)} %
                      </Text>
                      <Text style={[styles.tableCell, {flex: 0.6}]}>
                        --
                        {/* {parseFloat(item.igstRate).toFixed(2)}% */}
                      </Text>
                      <Text style={[styles.tableCell, {flex: 0.8}]}>
                        --
                        {/* {formatCurrencyWithoutSymbol(item.igstAmount)} */}
                      </Text>
                      <Text style={[styles.tableCell, {flex: 1.5}]}>
                        {formatCurrencyWithoutSymbol(item.amount)}
                      </Text>
                    </View>
                  ))}

                  {/* Total Row */}
                  <View
                    style={[
                      styles.tableRow,
                      styles.totalRow,
                      {borderTopColor: '#001', borderTopWidth: 1},
                    ]}>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          flex: 7.6,
                          textAlign: 'right',
                          fontWeight: 'bold',
                        },
                      ]}>
                      Total:
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {flex: 1.5, fontWeight: 'bold'},
                      ]}>
                      {formatCurrencyWithoutSymbol(invoice?.totalAmount)}
                    </Text>
                  </View>

                  {/* Rounded Off Row */}
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        styles.tableCell,
                        {flex: 7.6, textAlign: 'right'},
                      ]}>
                      Less : Rounded off (-)
                    </Text>
                    <Text style={[styles.tableCell, {flex: 1.5}]}>
                      {formatCurrencyWithoutSymbol(Math.abs(invoice?.roundOff))}
                    </Text>
                  </View>

                  {/* Grand Total Row */}
                  <View
                    style={[
                      styles.tableRow,
                      styles.grandTotalTableRow,
                      {borderTopColor: '#001', borderTopWidth: 1},
                    ]}>
                    <Text
                      style={[
                        styles.tableCell,
                        {flex: 2.4, textAlign: 'left', fontWeight: 'bold'},
                      ]}>
                      Grand Total
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {flex: 1.5, fontWeight: 'bold'},
                      ]}>
                      {invoice?.totalQuantity} Units
                    </Text>
                    <Text style={[styles.tableCell, {flex: 5.8}]}></Text>
                    <Text
                      style={[
                        {
                          flex: 1.7,
                          fontWeight: 'bold',
                          fontSize: wp(2.2),
                          color: '#000',
                          textAlign: 'center',
                          minHeight: hp(3),
                          paddingHorizontal: wp(0.3),
                        },
                      ]}>
                      {formatCurrencyWithoutSymbol(invoice?.grandTotal)}
                    </Text>
                  </View>
                </View>

                {/* Tax Summary Table */}
                <View style={styles.taxSummaryTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.taxHeaderText, {flex: 1}]}>
                      Tax Rate
                    </Text>
                    <Text style={[styles.taxHeaderText, {flex: 1.2}]}>
                      Taxable Amt.
                    </Text>
                    <Text style={[styles.taxHeaderText, {flex: 1.2}]}>
                      IGST Amt.
                    </Text>
                    <Text style={[styles.taxHeaderText, {flex: 1.2}]}>
                      Total Tax
                    </Text>
                  </View>

                  {/* Tax row for 18% */}
                  {Object.entries(invoice?.taxBreakdown).map(
                    ([rate, tax], index) => (
                      <View
                        key={index}
                        style={[
                          styles.tableRow,
                          {borderTopWidth: 1, borderTopColor: '#000'},
                        ]}>
                        <Text style={[styles.taxCell, {flex: 1}]}>{rate}</Text>
                        <Text style={[styles.taxCell, {flex: 1.2}]}>
                          {formatCurrencyWithoutSymbol(
                            tax.taxableAmount - tax.taxAmount,
                          )}
                        </Text>
                        <Text style={[styles.taxCell, {flex: 1.2}]}>
                          {formatCurrencyWithoutSymbol(tax.taxAmount)}
                        </Text>
                        <Text style={[styles.taxCell, {flex: 1.2}]}>
                          {formatCurrencyWithoutSymbol(tax.taxAmount)}
                        </Text>
                      </View>
                    ),
                  )}

                  {/* Total Tax Row */}
                  <View
                    style={[
                      styles.tableRow,
                      styles.totalRow,
                      {
                        borderTopWidth: 1,
                        borderTopColor: '#000',
                        borderBottomColor: '#000',
                        borderBottomWidth: 1,
                      },
                    ]}>
                    <Text
                      style={[styles.taxCell, {flex: 1, fontWeight: 'bold'}]}>
                      Total
                    </Text>
                    <Text
                      style={[styles.taxCell, {flex: 1.2, fontWeight: 'bold'}]}>
                      {formatCurrencyWithoutSymbol(invoice?.totalTaxableAmount)}
                    </Text>
                    <Text
                      style={[styles.taxCell, {flex: 1.2, fontWeight: 'bold'}]}>
                      {formatCurrencyWithoutSymbol(invoice?.totalTax)}
                    </Text>
                    <Text
                      style={[styles.taxCell, {flex: 1.2, fontWeight: 'bold'}]}>
                      {formatCurrencyWithoutSymbol(invoice?.totalTax)}
                    </Text>
                  </View>
                </View>

                {/* Amount in Words */}
                <View style={styles.amountWordsSection}>
                  <Text style={styles.amountWordsText}>
                    {`Rupees ${
                      toWords(invoice?.totalAmount).charAt(0).toUpperCase() +
                      toWords(invoice?.totalAmount).slice(1)
                    } Only`}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopColor: '#000',
                    borderTopWidth: 1,
                  }}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        marginTop: hp(1),
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#000',
                      },
                    ]}>
                    Declaration
                  </Text>
                  <Text style={styles.msmeText}>
                    MSME NO. UDYAM-DL-03-0015844
                  </Text>
                </View>

                <View style={styles.bankDetails}>
                  <Text style={styles.sectionTitle}>Bank Details :</Text>
                  <View>
                    <Text style={styles.bankText}>
                      HDFC BANK A/C NO. 50200027518030
                    </Text>
                    <Text style={styles.bankText}>IFSC CODE: HDFC0000158</Text>
                  </View>
                </View>

                {/* Footer Section */}
                <View style={styles.footerSection}>
                  <View style={styles.leftFooter}>
                    <Text style={styles.sectionTitle}>
                      Terms & Conditions :
                    </Text>
                    <Text style={styles.termText}>E.& O.E.</Text>
                    <Text style={styles.termText}>
                      1. Goods once sold will not be taken back.
                    </Text>
                    <Text style={styles.termText}>
                      2. Interest @ 18% p.a. will be charged if the payment
                    </Text>
                    <Text style={styles.termText}>
                      is not made within the 45 days.
                    </Text>
                    <Text style={styles.termText}>
                      3. Subject to 'Delhi' Jurisdiction only.
                    </Text>
                  </View>

                  <View style={styles.middleFooter}>
                    <Text style={styles.qrTitle}>E-Invoice QR Code</Text>
                    {/* Placeholder for QR Code image, replace with actual Image component later */}
                    {/* <View style={styles.qrPlaceholder} /> */}
                    <Image
                      source={{uri: invoice?.qrCodeImage}}
                      style={styles.qrCodeImage}
                    />
                  </View>

                  <View style={styles.rightFooter}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        width: '100%',
                        padding: wp(2),
                      }}>
                      <Text style={styles.receiverSignatureTitle}>
                        Receiver's Signature :
                      </Text>
                    </View>
                    <View style={styles.signatureContainer}>
                      <Text style={styles.signatureForCompany}>
                        for SARAL CHEMICALS
                      </Text>
                      <View style={styles.signatureLine} />
                      <Text style={styles.signatureText}>
                        Authorised Signatory
                      </Text>
                    </View>
                    {/* Add an empty view or line for receiver's signature area if needed */}
                  </View>
                </View>
              </View>
            </ViewShot>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <LinearGradient
              colors={['#101924', '#38587F']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.actionButton, {marginRight: wp(2)}]}>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={downloadInvoice}
                disabled={isGeneratingPDF}>
                <Text style={[styles.buttonText, {color: '#FFF'}]}>
                  Download Image
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={['#28a745', '#20c997']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.actionButton, {marginRight: wp(2)}]}>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={generatePDF}
                disabled={isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={[styles.buttonText, {color: '#FFF'}]}>
                    Generate PDF
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            {/* Share button commented out as in your original code */}
          </View>

          {isGeneratingPDF && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#101924" />
                <Text style={styles.loadingText}>Generating PDF...</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: screenHeight * 0.9,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    overflow: 'hidden', // Ensure content within is clipped to borders
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#101924',
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: wp(1),
    paddingTop: hp(1),
  },
  invoiceContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: hp(2),
  },
  gstinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.8),
  },
  gstinText: {
    fontSize: wp(2.2),
    fontWeight: 'bold',
    color: '#000',
  },
  originalCopyText: {
    fontSize: wp(2.2),
    fontWeight: 'bold',
    color: '#000',
  },
  taxInvoiceHeader: {
    alignItems: 'center',
  },
  taxInvoiceText: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
  },
  companyHeader: {
    alignItems: 'center',
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  companyName: {
    fontSize: wp(5.5),
    fontWeight: 'bold',
    color: '#000',
  },
  companyAddress: {
    fontSize: wp(3.2),
    color: '#000',
    textAlign: 'center',
    marginBottom: hp(0.1),
  },
  companyContact: {
    fontSize: wp(2.8),
    color: '#000',
    marginBottom: hp(0.1),
    textAlign: 'center',
  },
  detailsSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: hp(18),
  },
  leftColumn: {
    flex: 1,
    padding: wp(1.2),
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  rightColumn: {
    flex: 1,
    padding: wp(1.2),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.3),
  },

  detailLabelContainer: {
    flexDirection: 'row',
    width: wp(22),
    justifyContent: 'space-between',
    marginRight: wp(2),
  },

  detailLabelText: {
    fontSize: wp(3),
    color: '#000',
    // flexShrink: 1,
    flex: 1,
  },

  detailColon: {
    fontSize: wp(3),
    color: '#000',
    // paddingLeft: wp(1),
  },

  detailValue: {
    fontSize: wp(3),
    color: '#000',
  },

  sectionTitle: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp(0.1),
  },
  partyName: {
    fontSize: wp(3.2),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp(0.2),
  },
  partyAddress: {
    fontSize: wp(2.5),
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: hp(0.3),
  },
  detailLabel: {
    fontSize: wp(3),
    color: '#000',
    width: '49%',
  },
  detailValue: {
    fontSize: wp(3),
    width: '50%',
    color: '#000',
  },
  irnInfoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#001',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(1),
    width: '100%',
  },
  ack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  irnInfoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  irnInfoLabel: {
    fontSize: wp(2.2),
    fontWeight: '500',
    color: '#000',
    marginRight: wp(1),
  },
  irnInfoValue: {
    fontSize: moderateScale(8),
    color: '#000',
    flexShrink: 1,
  },
  irnSection: {
    padding: wp(2.5),
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  irnValue: {
    fontSize: wp(2.5),
    color: '#000',
    flex: 1,
  },
  tableContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
  },
  tableHeaderText: {
    fontSize: wp(2.1),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flexWrap: 'nowrap',
    borderRightColor: '#000',
    borderRightWidth: 0.5,
  },
  taxHeaderText: {
    fontSize: wp(2.1),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  tableRow: {
    flexDirection: 'row',
    // borderTopWidth: 1,
    // borderTopColor: '#000',
    minHeight: hp(2.5),
    alignItems: 'flex-start',
  },
  tableCell: {
    fontSize: wp(2.2),
    color: '#000',
    textAlign: 'center',
    minHeight: hp(4),
    maxHeight: hp(4),
    borderRightColor: '#000',
    borderRightWidth: 0.5,
    paddingHorizontal: wp(0.3),
  },
  taxCell: {
    fontSize: wp(2.2),
    color: '#000',
    textAlign: 'center',
    minHeight: hp(3),
    paddingHorizontal: wp(0.3),
  },
  totalRow: {
    // backgroundColor: '#f9f9f9',
    // borderTopWidth: 1,
    // borderTopColor: '#000',
  },
  grandTotalTableRow: {
    backgroundColor: '#FFF',
    // borderTopWidth: 1,
    // borderTopColor: '#000',

    paddingHorizontal: wp(2),
    paddingVertical: hp(0),
  },
  taxSummaryTable: {
    width: 250,
    marginTop: hp(1),
    marginLeft: wp(2),
    marginBottom: hp(1),

    // borderWidth: 1,
    // borderColor: '#000',
  },
  amountWordsSection: {
    padding: wp(3),
  },
  amountWordsText: {
    fontSize: wp(2.8),
    fontWeight: 'bold',
    color: '#000',
  },
  footerSection: {
    flexDirection: 'row',
    minHeight: hp(25),
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  leftFooter: {
    flex: 1.2,
    padding: wp(2.5),
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  middleFooter: {
    flex: 0.7,
    padding: wp(3),
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    // justifyContent: 'space-between', // Distribute space between QR and signature
  },
  rightFooter: {
    flex: 1.8,
    // padding: wp(2.5),
    alignItems: 'center',
    justifyContent: 'flex-end', // Push content to the bottom
  },
  termText: {
    fontSize: wp(2.5),
    color: '#000',
    marginBottom: hp(0.2),
  },
  msmeText: {
    fontSize: wp(3),
    color: '#000',
    fontWeight: '600',
    marginBottom: hp(1),
  },
  bankDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#000',
    padding: wp(2),
  },
  bankText: {
    fontSize: wp(2.8),
    fontWeight: '500',
    color: '#000',
    marginLeft: hp(0.2),
  },
  qrTitle: {
    fontSize: wp(3),
    color: '#000',
    marginBottom: hp(1),
  },
  qrPlaceholder: {
    width: wp(18),
    height: wp(18),
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f0f0f0', // Visual placeholder
  },
  qrCodeImage: {
    // For when you integrate actual QR code image
    width: wp(18),
    height: wp(18),
    borderWidth: 1,
    borderColor: '#000',
    // marginBottom: hp(2),
  },
  signatureContainer: {
    width: '100%', // Take full width of middle footer
    alignItems: 'center',
    marginTop: 'auto', // Pushes this container to the bottom of middleFooter
  },
  signatureForCompany: {
    fontSize: wp(3),
    color: '#000',
    marginBottom: hp(0.5),
  },
  signatureText: {
    fontSize: wp(3),
    color: '#000',
  },
  signatureLine: {
    // width: wp(25),
    height: 1,
    backgroundColor: '#000',
    marginVertical: hp(2), // Reduced vertical margin to bring text closer
  },
  receiverSignatureTitle: {
    fontSize: wp(3),
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  actionButton: {
    flex: 1,
    borderRadius: wp(2),
  },
  buttonTouchable: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFF',
    padding: wp(6),
    borderRadius: wp(3),
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(1),
    fontSize: wp(4),
    color: '#101924',
    fontWeight: '600',
  },
});

export default InvoiceModal;
