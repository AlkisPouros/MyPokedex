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
      <Box>
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
        
          <Grid
            container
            spacing={2}
            sx={{
              height: "100%",
              p: -2,
              mt: 4,
              mb: 4,
            }}
            justifyContent='center'
            alignItems='center'
          >
            {/** <Skeleton variant="rectangular" /> */}
            {Array.from({ length: skeletons }).map((_, index) => (
              <Grid
                size={{ xs: 12, sm: 6, lg: 4 }}
                key={index}
                sx={{p : 1 ,maxWidth: 250, minWidth: 250}} 
                alignItems="center"
              >
                <Skeleton
                  variant="rectangular"
                  animation="pulse"
                  sx={{
                    width: 234,
                    height: 244,
                    borderRadius: "8%",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
    </>
  );
};

export default Skeletons;
