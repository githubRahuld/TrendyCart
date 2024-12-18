import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFooter(true);
    }, 2000);

    return () => {
      clearTimeout(timer); // Cleanup timer
      setShowFooter(false); // Reset state when URL changes
    };
  }, [location.pathname]);

  return (
    <>
      {showFooter && (
        <Box
          component="footer"
          sx={{
            py: 3,
            mt: "auto",
            backgroundImage: 'url("/img/bg.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              component="p"
              sx={{
                fontFamily: "Fascinate Inline, sans-serif",
                fontWeight: "bold",
              }}
            >
              &copy; 2024 TrendyCart. All rights reserved.
            </Typography>
            <Box>
              <IconButton
                sx={{ color: "white", "&:hover": { color: "black" } }}
                aria-label="Facebook"
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{ color: "white", "&:hover": { color: "black" } }}
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{ color: "white", "&:hover": { color: "black" } }}
                aria-label="Instagram"
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{ color: "white", "&:hover": { color: "black" } }}
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Designed with 💙 by TrendyCart{" "}
              <span className="text-black">@Rahul Dhakad</span>
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Footer;
