const main = {
  backgroundColor: "#fff",
  color: "#212121",
  width: "100%",
  height: "100%",
};

const container = {
  margin: "auto",
  maxWidth: "780px",
  padding: "20px",
  borderRadius: "10px",
  backgroundColor: "#eee",
};

const coverSection = {
  backgroundColor: "#fff",
  padding: "10px 30px",
  borderRadius: "10px",
  boxShadow: "0 0 18px 5px rgba(0, 0, 0, 0.3)",
};

const center = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoSection = {
  ...center,
  marginBottom: "10px",
};

const upperSection = {
  ...center,
  textAlign: "center" as const,
  marginBottom: "30px",
};

const lowerSection = { marginBottom: "20px" };

const verificationSection = {
  textAlign: "center" as const,
};

const fontFamily =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif";

const h1 = {
  color: "#363737",
  fontFamily: fontFamily,
  fontSize: "26px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#2754C5",
  fontFamily: fontFamily,
  fontSize: "13px",
  textDecoration: "underline",
};

const button = {
  backgroundColor: "#1cd760",
  color: "#fff",
  padding: "1rem 3rem",
  borderRadius: "5px",
  fontFamily: fontFamily,
  fontSize: "14px",
  fontWeight: "bold",
};

const text = {
  color: "#363737",
  fontFamily: fontFamily,
  fontSize: "14px",
};

const mainText = {
  ...text,
  padding: "0 20px",
  marginBottom: "14px",
};

const cautionText = {
  ...text,
  margin: "0px",
  padding: "0 20px",
  color: "#777777",
  textAlign: "center" as const,
};

const footerText = {
  ...text,
  color: "#777777",
  fontSize: "12px",
  textAlign: "center" as const,
  backgroundColor: "#fff",
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  margin: "25px 0",
  fontFamily: "monospace",
  fontWeight: "bold",
  fontSize: "40px",
  textAlign: "center" as const,
  letterSpacing: "10px",
  color: "#1cd760",
};

const validityText = {
  ...text,
  margin: "0px",
  textAlign: "center" as const,
};

const spanText = {
  fontWeight: "bold",
  color: "#1cd760",
};

const divider = {
  display: "inline-block",
  padding: "0 8px",
  borderRight: "1px solid #ccc",
};

export {
  main,
  container,
  coverSection,
  logoSection,
  upperSection,
  verificationSection,
  lowerSection,
  h1,
  link,
  button,
  mainText,
  verifyText,
  codeText,
  validityText,
  cautionText,
  spanText,
  footerText,
  divider,
};
