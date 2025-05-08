import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import Swal from "sweetalert2"; 

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f2f2f2",
    padding: 50,
  },
  certificate: {
    textAlign: "center",
    border: "5px solid #f39c12",
    borderRadius: 15,
    padding: 40,
    backgroundColor: "#34495e",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: 30, 
    fontWeight: "bold",
    color: "#f39c12",
    marginBottom: 20,
    whiteSpace: "nowrap", 
  },
  subtitle: {
    fontSize: 22,
    color: "#3498db",
    marginBottom: 15,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 10,
  },
  score: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: "#bdc3c7",
    marginTop: 10,
  },
  signatureSection: {
    marginTop: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  signature: {
    textAlign: "center",
    width: "60%",
  },
  seal: {
    textAlign: "center",
    width: "45%",
  },
  signatureImage: {
    width: "120px",
    height: "auto",
    marginBottom: 10,
    marginLeft: 50,
  },
  sealImage: {
    width: "120px",
    height: "auto",
    marginBottom: 10,
    marginLeft: 25,
  },
});

// Certificate Document Component
const CertificateDocument = ({ userName, score }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.certificate}>
        <Text style={styles.title}>Certificate of Achievement</Text>
        <Text style={styles.subtitle}>This is to certify that</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.subtitle}>has successfully completed the quiz with a score of</Text>
        <Text style={styles.score}>{score} Points</Text>
        <Text style={styles.date}>Issued on {new Date().toLocaleDateString()}</Text>

        <View style={styles.signatureSection}>
          <View style={styles.signature}>
            <Image
              style={styles.signatureImage}
              src="/sign-main_sign.png" 
            />
            <Text>Instructor's Signature</Text>
          </View>
          <View style={styles.seal}>
            <Image
              style={styles.sealImage}
              src="/seal-main.png" 
            />
            <Text>Official Seal</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const CertificateGenerator = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userDetails"));
    if (storedData && storedData.name) {
      setUserName(storedData.name);
    }

    const storedScore = parseInt(localStorage.getItem("quizScore"), 10) || 0;
    setScore(storedScore);
  }, []);

  const handleDownload = () => {
    
    Swal.fire({
      title: "Generating Certificate...",
      text: "Please wait while the certificate is being generated.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); 
      },
      timer: 2000, 
    }).then(() => {
      
      Swal.fire({
        icon: "success",
        title: "Download Ready",
        text: "Your certificate is ready to download.",
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 text-white">
      {/* Certificate Display */}
      <div className="border-8 border-yellow-500 p-10 rounded-2xl shadow-2xl w-full max-w-3xl text-center bg-gray-800">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
          Certificate of Achievement
        </h1>
        <p className="text-xl mb-2">This is to certify that</p>
        <h2 className="text-3xl font-bold text-blue-400">{userName}</h2>
        <p className="text-lg mt-2">has successfully completed the quiz with a score of</p>
        <h3 className="text-2xl font-bold text-green-400">{score} Points</h3>
        <div className="mt-6 text-sm text-gray-400">
          Issued on {new Date().toLocaleDateString()}
        </div>

        {/* Signature & Seal Section */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex flex-col items-center">
            <img
              src="/sign-main.avif" 
              alt="Instructor's Signature"
              className="w-32 h-[75px] object-contain mb-1"
            />
            <hr className="border-gray-400 w-32 mx-auto" />
            <p className="text-sm">Instructor's Signature</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/seal-main.png" 
              alt="Official Seal"
              className="w-20 h-20 object-contain mb-1"
            />
            <hr className="border-gray-400 w-32 mx-auto" />
            <p className="text-sm">Official Seal</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/quiz-progress")}
          className="px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-semibold transition-all transform hover:scale-105"
        >
          🔙 Back to Quiz Progress
        </button>
        {/* <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-500 rounded-xl hover:bg-green-600 text-white font-semibold transition-all transform hover:scale-105"
        >
          📜 Generate & Download PDF
        </button> */}

        {/* The PDFDownloadLink will trigger the download */}
        <PDFDownloadLink
          document={<CertificateDocument userName={userName} score={score} />}
          fileName={`${userName}_certificate.pdf`} // Download name based on user's name
        >
          {({ loading }) =>
            loading ? (
              <button className="px-6 py-3 bg-green-500 rounded-xl text-white font-semibold">
                📜 Generating...
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-green-500 rounded-xl text-white font-semibold"
              >
                📜 Download PDF
              </button>
            )
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default CertificateGenerator;
