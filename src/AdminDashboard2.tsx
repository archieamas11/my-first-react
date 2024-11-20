import React, { useState, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// Helper function to generate lots
const generateLots = () => {
  const sectors = ["A", "B", "C", "D"];
  let id = 1;
  return sectors.flatMap((sector) =>
    Array.from({ length: 100 }, (_, i) => ({
      id: id++,
      number: `${sector}${i + 1}`,
      sector,
      block: i + 1,
      available: Math.random() > 0.3,
      customerId: null,
      deceasedId: null,
    }))
  );
};

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState("lots");

  // State management for lots, services, records, and customers
  const [lots, setLots] = useState<
    {
      id: number;
      number: string;
      sector: string;
      block: number;
      available: boolean;
      customerId: number | null;
      deceasedId: number | null;
    }[]
  >(generateLots());
  const [lotFilter, setLotFilter] = useState("all");
  const [selectedLot, setSelectedLot] = useState<{
    id: number;
    number: string;
    sector: string;
    block: number;
    available: boolean;
    customerId: number | null;
    deceasedId: number | null;
  } | null>(null);

  // Services, records
  const [services, setServices] = useState([
    { id: 1, name: "Cleaning", price: 999 },
    { id: 2, name: "Grave Restoration", price: 2500 },
  ]);

  // Deceased records data
  const [deceasedRecords, setDeceasedRecords] = useState([
    {
      id: 1,
      name: "Lebron James",
      dateOfDeath: "2023-01-01",
      lotId: 2,
      customerId: 1,
    },
  ]);

  // Customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Archie Albarico",
      email: "archiealbarico@gmail.com",
      phone: "123-456-7890",
    },
  ]);

  // New state variables for adding new service
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [newRecord, setNewRecord] = useState({
    name: "",
    dateOfDeath: "",
    customerId: "",
  });

  // New state variables for adding new customer
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // New state variables for booking lot
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [bookingLot, setBookingLot] = useState<{
    id: number;
    number: string;
    sector: string;
    block: number;
    available: boolean;
    customerId: number | null;
    deceasedId: number | null;
  } | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  // Filtered and sorted lots
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      if (lotFilter === "available") return lot.available;
      if (lotFilter === "occupied") return !lot.available;
      return true;
    });
  }, [lots, lotFilter]);

  // Functions for managing lots, services, records, and customers
  const bookLot = (lotId: number) => {
    const lot = lots.find((l) => l.id === lotId);
    if (lot) {
      setBookingLot(lot);
    }
  };

  // Confirm booking
  const confirmBooking = () => {
    if (bookingLot) {
      if (isNewCustomer) {
        const newCustomerId = customers.length + 1;
        setCustomers([...customers, { id: newCustomerId, ...newCustomer }]);
        setSelectedCustomer(newCustomerId.toString());
      }
      setLots(
        lots.map((lot) =>
          lot.id === bookingLot.id
            ? {
                ...lot,
                available: false,
                customerId: parseInt(selectedCustomer),
              }
            : lot
        )
      );
      setBookingLot(null);
      setNewCustomer({ name: "", email: "", phone: "" });
      setIsNewCustomer(false);
    }
  };

  // Add new service
  const addService = () => {
    if (newService.name && newService.price) {
      setServices([
        ...services,
        {
          id: services.length + 1,
          name: newService.name,
          price: Number(newService.price),
        },
      ]);
      setNewService({ name: "", price: "" });
    }
  };

  // Add new record
  const addRecord = () => {
    if (newRecord.name && newRecord.dateOfDeath && newRecord.customerId) {
      const customer = customers.find(
        (c) => c.id === parseInt(newRecord.customerId)
      );
      if (customer) {
        const availableLot = lots.find(
          (lot) => lot.customerId === customer.id && !lot.deceasedId
        );
        if (availableLot) {
          const newRecordId = deceasedRecords.length + 1;
          setDeceasedRecords([
            ...deceasedRecords,
            {
              id: newRecordId,
              ...newRecord,
              lotId: availableLot.id,
              customerId: parseInt(newRecord.customerId),
            },
          ]);
          setLots(
            lots.map((lot) =>
              lot.id === availableLot.id
                ? { ...lot, deceasedId: newRecordId }
                : lot
            )
          );
          setNewRecord({ name: "", dateOfDeath: "", customerId: "" });
        } else {
          alert("No available lot found for this customer.");
        }
      } else {
        alert("Customer not found.");
      }
    }
  };

  // Delete record
  const deleteRecord = (id: number) => {
    setDeceasedRecords(deceasedRecords.filter((record) => record.id !== id));
    setLots(
      lots.map((lot) =>
        lot.deceasedId === id ? { ...lot, deceasedId: null } : lot
      )
    );
  };

  // Add new customer
  const addCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      setCustomers([
        ...customers,
        { id: customers.length + 1, ...newCustomer },
      ]);
      setNewCustomer({ name: "", email: "", phone: "" });
    }
  };

  // Delete customer
  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
    setDeceasedRecords(
      deceasedRecords.filter((record) => record.customerId !== id)
    );
    setLots(
      lots.map((lot) =>
        lot.customerId === id
          ? { ...lot, customerId: null, deceasedId: null, available: true }
          : lot
      )
    );
  };

  // Render map View
  const renderMap = () => {
    return (
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
      >
        {["A", "B", "C", "D"].map((sector) => (
          <Paper key={sector} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sector {sector}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(10, 1fr)",
                gap: 1,
              }}
            >
              {lots
                .filter((lot) => lot.sector === sector)
                .map((lot) => (
                  <Button
                    key={lot.id}
                    variant="contained"
                    size="small"
                    onClick={() => setSelectedLot(lot)}
                    sx={{
                      minWidth: 0,
                      p: 1,
                      backgroundColor: lot.available
                        ? "success.light"
                        : "error.light",
                      "&:hover": {
                        backgroundColor: lot.available
                          ? "success.main"
                          : "error.main",
                      },
                    }}
                  >
                    {lot.block}
                  </Button>
                ))}
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  // Handle drawer open and close
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case "lots":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Lot Management
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="lot-filter-label">Filter Lots</InputLabel>
              <Select
                labelId="lot-filter-label"
                value={lotFilter}
                label="Filter Lots"
                onChange={(e) => setLotFilter(e.target.value)}
              >
                <MenuItem value="all">All Lots</MenuItem>
                <MenuItem value="available">Available Lots</MenuItem>
                <MenuItem value="occupied">Occupied Lots</MenuItem>
              </Select>
            </FormControl>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lot ID</TableCell>
                    <TableCell>Lot Number</TableCell>
                    <TableCell>Sector</TableCell>
                    <TableCell>Block</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLots.slice(0, 10).map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell>{lot.id}</TableCell>
                      <TableCell>{lot.number}</TableCell>
                      <TableCell>{lot.sector}</TableCell>
                      <TableCell>{lot.block}</TableCell>
                      <TableCell>
                        {lot.available ? "Available" : "Occupied"}
                      </TableCell>
                      <TableCell>
                        {lot.available && (
                          <Button
                            variant="contained"
                            onClick={() => bookLot(lot.id)}
                          >
                            Book
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Map View
              </Typography>
              {renderMap()}
            </Box>
          </Box>
        );
      case "services":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Services Management
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsAddServiceOpen(true)}
            >
              Add Service
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service Name</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>₱{service.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case "records":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Deceased Records
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsAddRecordOpen(true)}
            >
              Add Record
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date of Death</TableCell>
                    <TableCell>Lot Number</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deceasedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.dateOfDeath}</TableCell>
                      <TableCell>
                        {lots.find((l) => l.id === record.lotId)?.number}
                      </TableCell>
                      <TableCell>
                        {
                          customers.find((c) => c.id === record.customerId)
                            ?.name
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteRecord(record.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case "customers":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Customer Management
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsAddCustomerOpen(true)}
            >
              Add Customer
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Deceased Loved Ones</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        {deceasedRecords
                          .filter((r) => r.customerId === customer.id)
                          .map((r) => r.name)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteCustomer(customer.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Cemetery Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Lot Management", "Services", "Deceased Records", "Customers"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() =>
                    setCurrentView(
                      ["lots", "services", "records", "customers"][index]
                    )
                  }
                >
                  <ListItemIcon>
                    {index === 0 ? (
                      <DashboardIcon />
                    ) : index === 1 ? (
                      <BarChartIcon />
                    ) : index === 2 ? (
                      <LayersIcon />
                    ) : (
                      <PeopleIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {renderContent()}
      </Main>

      {/* Dialogs */}
      <Dialog open={Boolean(bookingLot)} onClose={() => setBookingLot(null)}>
        <DialogTitle>Book Lot {bookingLot?.number}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an existing customer or create a new one.
          </DialogContentText>
          <RadioGroup
            value={isNewCustomer ? "new" : "existing"}
            onChange={(e) => setIsNewCustomer(e.target.value === "new")}
          >
            <FormControlLabel
              value="existing"
              control={<Radio />}
              label="Existing Customer"
            />
            <FormControlLabel
              value="new"
              control={<Radio />}
              label="New Customer"
            />
          </RadioGroup>
          {isNewCustomer ? (
            <>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Phone"
                fullWidth
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </>
          ) : (
            <FormControl fullWidth margin="dense">
              <InputLabel id="select-customer-label">
                Select Customer
              </InputLabel>
              <Select
                labelId="select-customer-label"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingLot(null)}>Cancel</Button>
          <Button onClick={confirmBooking}>Confirm Booking</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
      >
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Service Name"
            fullWidth
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              addService();
              setIsAddServiceOpen(false);
            }}
          >
            Add Service
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddRecordOpen} onClose={() => setIsAddRecordOpen(false)}>
        <DialogTitle>Add New Deceased Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newRecord.name}
            onChange={(e) =>
              setNewRecord({ ...newRecord, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date of Death"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newRecord.dateOfDeath}
            onChange={(e) =>
              setNewRecord({ ...newRecord, dateOfDeath: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="select-customer-label">Select Customer</InputLabel>
            <Select
              labelId="select-customer-label"
              value={newRecord.customerId}
              onChange={(e) =>
                setNewRecord({ ...newRecord, customerId: e.target.value })
              }
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddRecordOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              addRecord();
              setIsAddRecordOpen(false);
            }}
          >
            Add Record
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
      >
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddCustomerOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              addCustomer();
              setIsAddCustomerOpen(false);
            }}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(selectedLot)} onClose={() => setSelectedLot(null)}>
        <DialogTitle>Lot Information: {selectedLot?.number}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedLot?.available ? (
              "This lot is available."
            ) : (
              <>
                <Typography>This lot is occupied.</Typography>
                {selectedLot?.customerId && (
                  <>
                    <Typography variant="subtitle1" mt={2}>
                      Customer Information:
                    </Typography>
                    {(() => {
                      const customer = customers.find(
                        (c) => c.id === selectedLot.customerId
                      );
                      return customer ? (
                        <Box>
                          <Typography>Name: {customer.name}</Typography>
                          <Typography>Email: {customer.email}</Typography>
                          <Typography>Phone: {customer.phone}</Typography>
                        </Box>
                      ) : (
                        <Typography>Customer information not found.</Typography>
                      );
                    })()}
                  </>
                )}
                {selectedLot?.deceasedId && (
                  <>
                    <Typography variant="subtitle1" mt={2}>
                      Deceased Person Information:
                    </Typography>
                    {(() => {
                      const deceased = deceasedRecords.find(
                        (d) => d.id === selectedLot.deceasedId
                      );
                      return deceased ? (
                        <Box>
                          <Typography>Name: {deceased.name}</Typography>
                          <Typography>
                            Date of Death: {deceased.dateOfDeath}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography>
                          Deceased person information not found.
                        </Typography>
                      );
                    })()}
                  </>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLot(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
