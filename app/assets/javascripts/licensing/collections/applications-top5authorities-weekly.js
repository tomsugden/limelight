define([
  'require',
  './applications-total-weekly',
  '../mixins/authorityhelpers',
  'extensions/models/group'
],
function (require, Applications, AuthorityHelpersMixin, Group) {
  /**
   * Retrieves data for a specific licence, grouped by authority,
   * for the "top 5" authorities
   */
  var LicenceApplications = Applications.extend({
    
    model: Group,
    
    queryParams: function () {
      return _.extend(Applications.prototype.queryParams.call(this, arguments), {
        group_by: 'authorityUrlSlug',
        limit: 5,
        sort_by: '_count:descending',
        collect: ['authorityName', 'licenceName']
      });
    },
    
    queryId: 'applications-top5authorities-weekly',
    
    comparator: function (a, b) {
      // sort by last value
      var aVal = a.get('values').last().get('_count');
      var bVal = b.get('values').last().get('_count');
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    },
    
    parse: function (response) {
      var data = [];
      
      _.each(response.data, function (group) {
        var attributes = {
          id: group.authorityUrlSlug,
          values: group.values
        };
        if (group.authorityName) {
          var authorityName = group.authorityName[0];
          attributes.title = this.getAuthorityShortName(authorityName);
        } else {
          attributes.title = group.authorityUrlSlug;
        }
        if (group.licenceName) {
          attributes.subTitle = group.licenceName[0];
        }
        data.push(attributes);
      }, this);
      
      return data;
    }
  });

  _.extend(LicenceApplications.prototype, AuthorityHelpersMixin);

  return LicenceApplications;
});
