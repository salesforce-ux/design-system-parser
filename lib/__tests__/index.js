// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { List } = require('immutable');
const { toTree } = require('../tree');

const parser = require('../../');

const scss = glob
  .sync(path.resolve(__dirname, '../__fixtures__/ui/**/*.scss'))
  .map(scssPath => fs.readFileSync(scssPath, 'utf8'))
  .join('\n');

const {
  components,
  component,
  utilities,
  utility,
  moduleComponents,
  moduleComponent,
  findVariant
} = parser(scss);

describe('parser', () => {
  describe('components', () => {
    it('returns a list of components', () => {
      const result = components().map(x => x.getIn(['annotations', 'name']));
      expect(result.toJS()).toEqual(['button', 'card', 'data-tables']);
    });
  });

  describe('utilities', () => {
    it('returns a list of utilities', () => {
      const result = utilities().map(x => x.getIn(['annotations', 'name']));
      expect(result.toJS()).toEqual(['alignment', 'borders', 'floats', 'grid']);
    });
  });

  describe('moduleComponents', () => {
    it('returns a list of moduleComponents', () => {
      const result = moduleComponents().map(x =>
        x.getIn(['annotations', 'name'])
      );
      expect(result.toJS()).toEqual(['buttons', 'zigzag']);
    });
  });

  describe('component', () => {
    describe('data tables', () => {
      let table;
      beforeEach(() => {
        table = component('data-tables').getOrElse(null);
      });
      it('finds the right component', () => {
        expect(table.getIn(['annotations', 'name'])).toEqual('data-tables');
      });
      it('adds the restrictee hierarchy tree', () => {
        expect(table.get('restrictees').count()).toEqual(1);
        expect(
          table
            .get('restrictees')
            .first()
            .get('restrictees')
            .count()
        ).toEqual(10);
        const restrictee = table.get('restrictees').first();
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual(
          '.slds-table'
        );
      });
      it('does not add itself as a restrictee', () => {
        expect(
          table
            .get('restrictees')
            .first()
            .get('id')
        ).toEqual('basic');
      });
      it('does not place overly verbose restricts on outter mentioned elements', () => {
        // slds-is-sortable__icon restrict looks like
        // @restrict .slds-table--fixed-layout th.slds-is-sortable .slds-icon
        const t = toTree(table).reduce(
          (acc, x) => acc.push(x.getIn(['annotations', 'selector'])),
          List()
        );
        const result = t.filter(x => x === '.slds-is-sortable__icon');
        expect(result.count()).toEqual(1);
      });
    });
    describe('button', () => {
      let button;
      beforeEach(() => {
        button = component('button').getOrElse(null);
      });
      it('finds the right component', () => {
        expect(button.getIn(['annotations', 'name'])).toEqual('button');
      });
      it('has a unique identifier', () => {
        expect(button.get('id')).toEqual('button');
      });
      it('adds the restrictees', () => {
        expect(button.get('restrictees').count()).toEqual(1);
        const restrictee = button.get('restrictees').first();
        expect(restrictee.get('restrictees').count()).toEqual(8);
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual(
          '.slds-button'
        );
      });
    });
  });
  describe('utility', () => {
    describe('borders', () => {
      let borders;
      beforeEach(() => {
        borders = utility('borders').getOrElse(null);
      });
      it('finds the right utiltity', () => {
        expect(borders.getIn(['annotations', 'name'])).toEqual('borders');
      });
      it('sets the id', () => {
        expect(borders.get('id')).toEqual('borders');
      });
      it('adds the restrictee hierarchy tree', () => {
        expect(borders.get('restrictees').count()).toEqual(4);
        const restrictee = borders.get('restrictees').first();
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual(
          '.slds-border--bottom'
        );
      });
    });
    describe('grid', () => {
      let grid;
      beforeEach(() => {
        grid = utility('grid').getOrElse(null);
      });
      it('adds the restrictee hierarchy tree', () => {
        expect(grid.get('restrictees').count()).toEqual(5);
        const restrictee = grid.get('restrictees').first();
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual(
          '.slds-col--bump-top'
        );
      });
    });
  });

  describe('moduleComponent', () => {
    describe('buttons', () => {
      let buttons;
      beforeEach(() => {
        buttons = moduleComponent('buttons').getOrElse(null);
      });
      it('finds the right component', () => {
        expect(buttons.getIn(['annotations', 'name'])).toEqual('buttons');
      });
      it('has a unique identifier', () => {
        expect(buttons.get('id')).toEqual('buttons');
      });
      it('adds the restrictees', () => {
        expect(buttons.get('restrictees').count()).toEqual(1);
        const restrictee = buttons.get('restrictees').first();
        expect(restrictee.get('restrictees').count()).toEqual(4);
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual(
          '.dsm-button'
        );
      });
    });
    describe('zigzag', () => {
      let zigzag;
      beforeEach(() => {
        zigzag = moduleComponent('zigzag').getOrElse(null);
      });
      it('finds the right component', () => {
        expect(zigzag.getIn(['annotations', 'name'])).toEqual('zigzag');
      });
      it('adds the restrictee hierarchy tree', () => {
        expect(zigzag.get('restrictees').count()).toEqual(1);
        expect(
          zigzag
            .get('restrictees')
            .first()
            .get('restrictees')
            .count()
        ).toEqual(1);
        const restrictee = zigzag.get('restrictees').first();
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual(
          '.dsm-zigzag'
        );
      });
      it('does not add itself as a restrictee', () => {
        expect(
          zigzag
            .get('restrictees')
            .first()
            .get('id')
        ).toEqual('base');
      });
    });
  });
});
