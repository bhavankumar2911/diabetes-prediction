import { TextField, Typography, Button, Grid, Box, Modal } from "@mui/material";
import { useState } from "react";
import Axios from "axios";
import Alert from "@mui/material/Alert";
import "./style.css";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    pedigreeFunction: "",
    age: "",
  });
  const [customAlert, setCustomAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDiabetic, setIsDiabetic] = useState(false);

  const handleDataChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = parseFloat(e.target.value);

    switch (fieldName) {
      case "pregnancies":
        setFormData({ ...formData, pregnancies: fieldValue });
        break;

      case "glucose":
        setFormData({ ...formData, glucose: fieldValue });
        break;

      case "bloodPressure":
        setFormData({ ...formData, bloodPressure: fieldValue });
        break;

      case "skinThickness":
        setFormData({ ...formData, skinThickness: fieldValue });
        break;

      case "insulin":
        setFormData({ ...formData, insulin: fieldValue });
        break;

      case "bmi":
        setFormData({ ...formData, bmi: fieldValue });
        break;

      case "pedigreeFunction":
        setFormData({ ...formData, pedigreeFunction: fieldValue });
        break;

      case "age":
        setFormData({ ...formData, age: fieldValue });
        break;

      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    // validation
    let isValid = true;
    for (const field in formData) {
      if (formData[field] === "") isValid = false;
    }

    if (isValid) {
      e.preventDefault();

      setShowModal(true);
      setLoading(true);

      try {
        const response = await Axios.post(
          `${process.env.REACT_APP_API}/predict`,
          {
            ...formData,
          }
        );

        const { diabetic } = response.data;

        setLoading(false);

        if (diabetic) setIsDiabetic(true);
        else setIsDiabetic(false);

        setCustomAlert({ ...customAlert, show: false });
      } catch (error) {
        setShowModal(false);
        setLoading(false);

        if (error.response) {
          const { response } = error;
          const { status } = response;

          // no response
          if (status === 0) {
            setCustomAlert({
              ...customAlert,
              type: "error",
              show: true,
              message: "No response from server.",
            });
          }
        } else {
          setCustomAlert({
            ...customAlert,
            type: "error",
            show: true,
            message: "Something went wrong.",
          });
        }
      }
    }
  };

  return (
    <div className="App">
      {customAlert.show && (
        <div className="alert-cont">
          <Alert
            severity={customAlert.type}
            onClose={() => setCustomAlert({ ...customAlert, show: false })}
          >
            {customAlert.message}
          </Alert>
        </div>
      )}

      {/* modal */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translateX(-50%)",
            p: "1rem",
            width: "75%",
            maxWidth: "500px",
            outline: "none",
          }}
        >
          {loading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={25} />
              <Typography variant="button" sx={{ ml: "1rem" }}>
                loading
              </Typography>
            </Box>
          )}

          {!loading && (
            <span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                {isDiabetic ? (
                  <Alert severity="warning" sx={{ width: "100%" }}>
                    You are diabetic.
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ width: "100%" }}>
                    You are safe.
                  </Alert>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginLeft: "1rem",
                  }}
                >
                  <span onClick={() => setShowModal(false)}>
                    <CloseIcon />
                  </span>
                </div>
              </div>

              <Typography
                variant="caption"
                sx={{
                  color: "error.main",
                  textAlign: "center",
                  display: "block",
                }}
              >
                This is only an experimental project with 76% accuracy.
              </Typography>
            </span>
          )}
        </Box>
      </Modal>

      <Grid container spacing={2}>
        <Grid item xs={0} sm={2} lg={3}></Grid>
        <Grid item xs={12} sm={8} lg={6}>
          <Box sx={{ pb: "2rem", pt: "2rem" }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Diabetes Prediction
            </Typography>

            {/* form */}
            <form action="#" onSubmit={handleSubmit}>
              <TextField
                type="number"
                label="Pregnancies"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                size="small"
                value={formData.pregnancies}
                onChange={handleDataChange}
                InputProps={{ name: "pregnancies" }}
                helperText={
                  <Typography variant="caption" display="block" gutterBottom>
                    Enter the number of pregnancies you had.
                  </Typography>
                }
              />

              <TextField
                type="number"
                label="Glucose"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                InputProps={{ name: "glucose" }}
                size="small"
                value={formData.glucose}
                onChange={handleDataChange}
                helperText={
                  <Typography variant="caption" display="block" gutterBottom>
                    Plasma glucose concentration over 2 hours in an oral glucose
                    tolerance test. Enter some value between 0 and 200 if you've
                    no idea.
                  </Typography>
                }
              />

              <TextField
                type="number"
                label="Blood pressure"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                InputProps={{ name: "bloodPressure" }}
                size="small"
                value={formData.bloodPressure}
                onChange={handleDataChange}
                helperText={
                  <Typography variant="caption" display="block" gutterBottom>
                    Enter the diastolic blood pressure(mm Hg) or some value
                    between 0 and 120 if you have no idea.
                  </Typography>
                }
              />

              <TextField
                type="number"
                label="Skin thickness"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                InputProps={{ name: "skinThickness" }}
                size="small"
                value={formData.skinThickness}
                onChange={handleDataChange}
                helperText={
                  <Typography variant="caption" display="block" gutterBottom>
                    Enter triceps skinfold thickness(mm) or some value between 0
                    and 100 if you have no idea.
                  </Typography>
                }
              />

              <TextField
                type="number"
                label="Insulin"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                InputProps={{ name: "insulin" }}
                size="small"
                value={formData.insulin}
                onChange={handleDataChange}
                helperText={
                  <Typography variant="caption" display="block" gutterBottom>
                    Enter 2 hour serum insulin test value(mu U/ml) or some value
                    between 0 and 850 if you have no idea.
                  </Typography>
                }
              />

              <TextField
                type="number"
                label="BMI"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                InputProps={{ name: "bmi" }}
                size="small"
                value={formData.bmi}
                onChange={handleDataChange}
                helperText={
                  <Typography variant="caption" display="block" gutterBottom>
                    Enter Body Mass Index(weight in kg/(height in m)^2). Use a{" "}
                    <a
                      href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
                      target="_blank"
                      rel="noreferrer"
                    >
                      calculator
                    </a>
                    .
                  </Typography>
                }
              />

              <TextField
                type="number"
                label="Diabetes pedigree function"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                InputProps={{ name: "pedigreeFunction" }}
                size="small"
                value={formData.pedigreeFunction}
                onChange={handleDataChange}
                helperText={
                  <Typography variant="caption" display="block" gutterBottom>
                    Diabetes pedigree function (a function which scores
                    likelihood of diabetes based on family history). Enter some
                    value between 0.1 and 2.4 if you've no idea.
                  </Typography>
                }
              />

              <TextField
                type="number"
                label="Age"
                variant="outlined"
                fullWidth={true}
                required={true}
                margin="normal"
                InputProps={{ name: "age" }}
                size="small"
                value={formData.age}
                onChange={handleDataChange}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ width: "100%", marginTop: "1rem" }}
                onClick={handleSubmit}
              >
                get diagnosis
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
