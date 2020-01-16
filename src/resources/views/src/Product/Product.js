import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { withStyles } from '@material-ui/core/styles'
import {
    Grid,
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
    Fab
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import { ProductActions } from "./actions/product";

const style = theme => ({
    field: {
        'height': '100%'
    },
    data: {
        'height': 'calc(100% - 52px)',
        'width': '100%'
    },
    item: {
        'width': '100%'
    },
    table: {
        'height': '100%'
    },
    fab: {
        'margin': '0',
        'top': 'auto',
        'right': '90px',
        'bottom': '25px',
        'left': 'auto',
        'position': 'fixed'
    }
})

const columns = [
    {
        id: 'standard',
        label: 'Эталонное наименование',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'name',
        label: 'Имя',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'volume',
        label: 'Объем, вес и дозы',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'unit',
        label: 'Единица измерения',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'packing',
        label: 'Фасовка',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'quantity',
        label: 'Количество единиц с учетом фасовки',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'generic',
        label: 'Международного непатентованного наименования',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'form',
        label: 'Форма',
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'category',
        label: 'Категория (класс)',
        align: 'center',
        format: value => value.toLocaleString()
    }
];

class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: null,
            dialog: false,
            page: 0,
            rowsPerPage: 10
        };
    }

    componentDidMount () {
        const { actions } = this.props
        const { rowsPerPage } = this.state

        return actions.products({ limit: rowsPerPage })
    }

    componentWillUnmount() {
        const { dispatch } = this.props

        dispatch({ type: 'PRODUCTS_CLEAR'})
    }

    render() {
        const { products, classes } = this.props
        const { product, dialog, page, rowsPerPage } = this.state

        const handleDelete = (id) => {
            const { actions } = this.props

            return actions.remove(id).then(
                () => {
                    return actions.products({ page: page + 1, limit: rowsPerPage })
                }
            )
        }

        const handleSave = (values, id = null) => {
            const { actions } = this.props

            if (id) {
                return actions.save(id, values)
            } else {
                return actions.add(values).then(
                    () => {
                        return actions.products({ page: page + 1, limit: rowsPerPage })
                    }
                )
            }
        }

        const handleChangePage = (event, newPage) => {
            const { actions } = this.props

            return actions.products({ page: ++newPage, limit: rowsPerPage }).then(
                () => {
                    this.setState({ page: --newPage })
                }
            )
        };

        const handleChangeRowsPerPage = event => {
            const { actions } = this.props

            this.setState({ page: 0, rowsPerPage: +event.target.value })

            return actions.products({ page: 1, limit: +event.target.value})
        };

        return (
            <Grid container direction="column" justify="space-between" alignItems="center" className={classes.field}>
                <Grid item className={classes.data}>
                    <TableContainer className={classes.table}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.data.map(item => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={item.id} onClick={() => { this.setState({ dialog: true, product: item })}}>
                                            <TableCell align="center">
                                                { item.standard }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.name }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.volume }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.unit ? item.unit.name : null }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.packing }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.quantity }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.generic ? item.generic.name : null }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.form ? item.form.name : null }
                                            </TableCell>
                                            <TableCell align="center">
                                                { item.category ? item.category.name : null }
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item className={classes.item}>
                    <TablePagination
                        rowsPerPageOptions={ [10, 25, 100] }
                        component="div"
                        count={ products.data.length ? products.meta.total : 0 }
                        rowsPerPage={ rowsPerPage }
                        page={ page }
                        onChangePage={ handleChangePage }
                        onChangeRowsPerPage={ handleChangeRowsPerPage }
                    />
                </Grid>
                <Fab size="medium" color="primary" aria-label="Добавить" className={ classes.fab } onClick={() => { this.setState({ dialog: true })}}>
                    <AddIcon />
                </Fab>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    const { products } = state.product

    return {
        products
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        actions: bindActionCreators(ProductActions, dispatch)
    }
}

Product = withStyles(style)(Product)

const connectedProduct = connect(mapStateToProps, mapDispatchToProps)(Product)
export { connectedProduct as Product }
