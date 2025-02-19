import { Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";

type SkeletonsProps = {
  skeletons: number;
  isUserSignedIn: boolean;
};

const Skeletons = ({
  skeletons,
  isUserSignedIn,
}: SkeletonsProps) => {
  return (
    <>
      <Box sx={{ width: "100%", maxWidth: 650 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1} sx={{ m: 1.5, justifyContent: "center" }}>
            <Skeleton
              variant="rectangular"
              width={254}
              height={32}
              animation="pulse"
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rounded"
              width={34}
              height={34}
              sx={{ borderRadius: 2 }}
              animation="pulse"
            />
            <Box
              sx={{
                width: "100%",
                height: "50%",
                maxWidth: 650,
                mt: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isUserSignedIn ? (
                  <>
                    <Skeleton
                      width={309.24}
                      height={71.52}
                      sx={{ p: 2, borderRadius: 2, width: "50%", pr: 1 }}
                    />

                    <Skeleton
                      width={52}
                      height={62}
                      sx={{ borderRadius: 2, flexGrow: 0.1, m: 1 }}
                    />
                  </>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width={110}
                    height={80}
                    sx={{ borderRadius: 7.5 }}
                  />
                )}
                {/** TODO HANDLE THE RADIUS */}
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            alignItems: "center",
            maxWidth: 650,
            flexGrow: 2,
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            {/** <Skeleton variant="rectangular" /> */}
            {Array.from({ length: skeletons }).map((_, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                key={index}
                width="100%"
              >
                <Skeleton
                  variant="rectangular"
                  animation="pulse"
                  sx={{
                    width: { xs: 223.19, sm: 280, md: 195, lg: 195 },
                    height: { xs: 238.69, sm: 300, md: 210, lg: 210 },
                    "@media (max-width :650px) and (min-width : 600px)": {
                      width: 250,
                    },
                    borderRadius: "8%",
                    margin: "auto",
                    mt: 0.5,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Skeletons;
