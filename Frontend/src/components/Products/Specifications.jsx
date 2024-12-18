import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Build,
  LocalShipping,
  DateRange,
  DeviceUnknown,
} from "@mui/icons-material";

const Specifications = ({ product }) => {
  return (
    <Card variant="outlined" sx={{ marginTop: 4, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Product Specifications
        </Typography>
        <List>
          <ListItem>
            <Build sx={{ mr: 1, color: "primary.main" }} />
            <ListItemText
              primary="Category"
              secondary={product.category || "N/A"}
            />
          </ListItem>
          <ListItem>
            <DeviceUnknown sx={{ mr: 1, color: "secondary.main" }} />
            <ListItemText
              primary="Tags"
              secondary={product.tags?.join(", ") || "N/A"}
            />
          </ListItem>
          <ListItem>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Weight: {product.weight || "N/A"} g
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Dimensions: {product.dimensions?.width || "N/A"} x{" "}
              {product.dimensions?.height || "N/A"} x{" "}
              {product.dimensions?.depth || "N/A"} mm
            </Typography>
          </ListItem>
          <ListItem>
            <DateRange sx={{ mr: 1, color: "warning.main" }} />
            <ListItemText
              primary="Warranty"
              secondary={product.warrantyInformation || "N/A"}
            />
          </ListItem>
          <ListItem>
            <LocalShipping sx={{ mr: 1, color: "info.main" }} />
            <ListItemText
              primary="Return Policy"
              secondary={product.returnPolicy || "N/A"}
            />
          </ListItem>
          <ListItem>
            <LocalShipping sx={{ mr: 1, color: "info.main" }} />
            <ListItemText
              primary="Shipping"
              secondary={product.shippingInformation || "N/A"}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default Specifications;
