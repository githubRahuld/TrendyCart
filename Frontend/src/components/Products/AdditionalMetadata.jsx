import React from "react";
import { Card, CardContent, Typography, Grid, Divider } from "@mui/material";

const AdditionalMetadata = ({ meta }) => {
  return (
    <Card className="mt-10" style={{ fontFamily: "Cinzel Decorative" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>
        <Grid container spacing={2} alignItems="center">
          {/* Barcode */}
          <Grid item xs={6}>
            <Typography variant="body1" component="strong">
              Barcode:
            </Typography>
            <Typography variant="body2">{meta.barcode || "N/A"}</Typography>
          </Grid>

          {/* QR Code */}
          <Grid item xs={6}>
            <Typography variant="body1" component="strong">
              QR Code:
            </Typography>
            <Typography variant="body2">
              {meta.qrCode ? (
                <img
                  src={meta.qrCode}
                  alt="QR Code"
                  className="inline w-16 h-16"
                />
              ) : (
                "N/A"
              )}
            </Typography>
          </Grid>

          {/* Created At */}
          <Grid item xs={6}>
            <Typography variant="body1" component="strong">
              Created At:
            </Typography>
            <Typography variant="body2">{meta.createdAt || "N/A"}</Typography>
          </Grid>

          {/* Updated At */}
          <Grid item xs={6}>
            <Typography variant="body1" component="strong">
              Updated At:
            </Typography>
            <Typography variant="body2">{meta.updatedAt || "N/A"}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: 2 }} />
      </CardContent>
    </Card>
  );
};

export default AdditionalMetadata;
